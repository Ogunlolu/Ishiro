# Ishiro — how work gets verified

Status: proposed with the Foundation slice, 18 Nov 2026.

An agent saying "done" proves nothing. This page is how any agent working on
Ishiro shows that a change works, and says plainly what it could not check.

## The rule

**No claim without evidence.** "It works" must come with what was run and
what it showed. Anything not checked is listed as not checked. An agent never
reports a check as passing unless it ran it and saw it pass in that session.

## The four layers

| Layer | What it proves | How |
|---|---|---|
| 1. Automatic checks | The code is sound and the rules hold | `npm run verify` on the agent's machine; the same checks run on GitHub for every pull request |
| 2. Seen running | The app really starts and each screen shows what it should, in light and dark | `npm run screenshots` opens every screen in a phone-sized browser, fails on any error, and saves pictures |
| 3. Proof the checks bite | The tests would notice if the thing broke | The agent breaks the new behaviour on purpose, sees a check fail, then restores it |
| 4. Second pair of eyes | The builder did not fool itself | A fresh agent reviews the change without the builder's reasoning |

Then the owner looks at the screenshots and, for anything a browser cannot
show, tries it on a real phone.

### What `npm run verify` runs

1. **Type check** — the code agrees with itself (`npm run typecheck`).
2. **Lint** — common mistakes (`npm run lint`).
3. **Tests** — behaviour and brand rules (`npm test`). This includes the
   accessibility rules that can be tested so far: text contrast at least
   4.5:1 in both colour schemes, and the main button being Guava with Ink
   text and at least 44 points tall.
4. **Expo health check** — the project set-up matches the installed Expo
   version (`npm run doctor`).
5. **Screen checks** — builds the web preview, opens each screen in light
   and dark, checks the text, font and colours really are that scheme's,
   taps through, and saves screenshots to `screenshots/`
   (`npm run screenshots`).

GitHub runs the same five steps on every pull request and keeps the
screenshots for 14 days. `main` is not yet set to refuse merges while they
fail; that is a repository setting only the owner can switch on.

One deliberate exception to "colours live only in `src/ui/tokens.ts`": the
splash screen and Android icon backgrounds in `app.json`, which the phone
shows before any app code runs.

## Rules for agents

- Run `npm run verify` before saying a slice is ready. Paste the result
  summary, not just "passed".
- Every new behaviour gets a test. Every new screen is added to the list in
  `scripts/screenshots.mjs` with the text it must show.
- For money logic, write the test first and see it fail. Add random-input
  tests for rules that must always hold (balances add up to zero; no
  fractions of a cent).
- For access rules, add tests that try to read another group's trip and
  must be refused.
- Do layer 3 for the main behaviour of each slice and say which break was
  tried.
- Never weaken, skip or delete a test to get a pass. If a test is wrong, say
  so and ask.
- Look at the screenshots yourself before showing them.

## The report every slice ends with

```
What was built      one or two lines
Verified            each check, what it showed
Broken on purpose   what was broken, which check caught it
Reviewed by         fresh agent: what it found, what was fixed
Not verified        everything that could not be checked, and why
For you to check    what needs a real phone
```

## What an agent cannot verify from the cloud

The screen checks run the web preview of the app, not the iPhone or Android
build. They cannot show: how it looks and feels on a real phone, native
navigation gestures, vibration, the splash screen and app icon, large system
text set in phone settings, or speed on a real device. These are always
listed under "For you to check".
