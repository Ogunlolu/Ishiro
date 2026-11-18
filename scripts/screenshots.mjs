// Opens the built web preview in a phone-sized browser and proves it runs:
// every screen must render its expected text with no errors, in light and dark.
// Saves a screenshot of each to ./screenshots. Run with: npm run screenshots
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const dist = resolve('dist');
const out = resolve('screenshots');

// Expected colours per scheme, read from the design tokens so the two cannot drift.
const tokens = readFileSync(resolve('src/ui/tokens.ts'), 'utf8');
function token(scheme, name) {
  const block = new RegExp(`${scheme}: \\{([^}]*)\\}`).exec(tokens)?.[1] ?? '';
  const hex = new RegExp(`${name}: '#([0-9A-Fa-f]{6})'`).exec(block)?.[1];
  if (!hex) throw new Error(`Could not read ${scheme}.${name} from src/ui/tokens.ts`);
  const n = parseInt(hex, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

// Each screen to check, and text that must be visible on it. The first text
// is a headline, which must be drawn in that scheme's Ink on its Paper.
const screens = [
  { name: 'home', path: '/', expect: ['ishiro', 'No trips yet.', 'Start a trip'] },
  { name: 'new-trip', path: '/new-trip', expect: ['New trip'] },
];
const schemes = ['light', 'dark'];

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
};

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No web build found in ./dist. Run "npm run build:web" first.');
  process.exit(1);
}

// Tiny static server; unknown paths fall back to index.html (single-page app).
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = normalize(join(dist, urlPath));
  const inside = file === dist || file.startsWith(dist + sep);
  const found = inside && existsSync(file) && statSync(file).isFile();
  if (!found && extname(urlPath) !== '') {
    // A missing file (script, font, image) is a real failure, not a page.
    res.writeHead(404).end();
    return;
  }
  if (!found) file = join(dist, 'index.html');
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Cloud sessions ship their own Chromium; elsewhere Playwright's download is used.
const preinstalled = '/opt/pw-browsers/chromium';
const browser = await chromium.launch(
  existsSync(preinstalled) ? { executablePath: preinstalled } : {},
);

const failures = [];
for (const scheme of schemes) {
  for (const screen of screens) {
    const label = `${screen.name} (${scheme})`;
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      colorScheme: scheme,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('requestfailed', (request) => errors.push(`failed to load ${request.url()}`));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} for ${response.url()}`);
    });

    try {
      await page.goto(base + screen.path, { waitUntil: 'networkidle' });
      for (const text of screen.expect) {
        await page.getByText(text, { exact: true }).first().waitFor({ timeout: 10_000 });
      }
      await page.evaluate(() => document.fonts.ready);
      const brandFontLoaded = await page.evaluate(() =>
        [...document.fonts].some((f) => f.family.includes('Bricolage') && f.status === 'loaded'),
      );
      if (!brandFontLoaded) errors.push('Bricolage Grotesque did not load');

      // The scheme must really change the colours, not just the label on the file.
      const seen = await page.getByText(screen.expect[0], { exact: true }).first().evaluate((el) => {
        let node = el;
        let background = 'rgba(0, 0, 0, 0)';
        while (node && background === 'rgba(0, 0, 0, 0)') {
          background = getComputedStyle(node).backgroundColor;
          node = node.parentElement;
        }
        return { text: getComputedStyle(el).color, background };
      });
      const want = { text: token(scheme, 'ink'), background: token(scheme, 'paper') };
      if (seen.text !== want.text) errors.push(`text is ${seen.text}, expected ${want.text}`);
      if (seen.background !== want.background) {
        errors.push(`background is ${seen.background}, expected ${want.background}`);
      }
    } catch (error) {
      errors.push(error.message.split('\n')[0]);
    }

    await page.screenshot({ path: join(out, `${screen.name}-${scheme}.png`) });
    await context.close();

    if (errors.length > 0) {
      failures.push(`${label}: ${errors.join('; ')}`);
      console.log(`FAIL  ${label}`);
    } else {
      console.log(`ok    ${label}`);
    }
  }
}

// One real journey: tapping the main button on Home must open the new trip screen.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Start a trip' }).click();
    await page.getByText('New trip', { exact: true }).first().waitFor({ timeout: 10_000 });
    if (new URL(page.url()).pathname !== '/new-trip') {
      throw new Error(`expected to land on /new-trip, got ${page.url()}`);
    }
    if (errors.length > 0) throw new Error(errors.join('; '));
    console.log('ok    tap "Start a trip" opens New trip');
  } catch (error) {
    failures.push(`tap "Start a trip": ${error.message.split('\n')[0]}`);
    console.log('FAIL  tap "Start a trip" opens New trip');
  }
  await context.close();
}

await browser.close();
server.close();

if (failures.length > 0) {
  console.error(`\n${failures.length} screen check(s) failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nAll screen checks passed. Screenshots in ./screenshots');
