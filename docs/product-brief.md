# Ishiro — product brief (draft for discussion)

Status: draft, 18 Nov 2026. Nothing here is decided until the open decisions in
section 11 are answered. No app code should be written before then.

## 1. The problem

On a group trip, different people pay for different things: one buys the
tickets, another covers the Uber, another the food. Nobody tracks it properly
in the moment. Afterwards someone reconstructs it from memory, bank statements
and chat messages, and the result is disputed. The disputes are rarely about
arithmetic. They are about:

- **Missing or late entries** — "you never said you paid for that".
- **Who was included** — "I wasn't at that dinner, why am I paying?"
- **Silent changes** — a number changes and nobody knows who changed it or why.
- **Unequal effort** — one person becomes the unpaid accountant and debt collector.
- **No ending** — debts drag on for weeks with awkward "send me your part" messages.

Ishiro's job: everyone on the trip sees the same ledger, can explain every
number in it, and reaches a clean, agreed finish.

## 2. Who it is for

- **The organiser**: fronts the big costs, most exposed, most motivated to
  install an app. This is the person we acquire.
- **Everyone else**: will tolerate the app only if joining takes seconds.
  They are the ones who decide whether the group actually uses it.

Typical group is 3–10 friends, family or colleagues on a trip lasting days to
weeks, often abroad, with patchy data and more than one currency.

## 3. What is already on the market

Most public comparisons are written by competing apps, so prices and limits
below are approximate. The "design style" column is my own characterisation,
not something the sources state; it should be checked against the live apps
during the design phase.

| App | What it promises | Where it is strong | Where it falls short | Design style |
|---|---|---|---|---|
| **Splitwise** | The standard for shared expenses since 2011; "less stress when sharing expenses" | Best known, so friends often already have it; many split types; long-running groups | Free tier now reported as capped at roughly 3–5 expenses a day with ads and a cooldown; Pro around $40/year; everyone needs an account; built for flatmates as much as trips | Utilitarian lists, teal and orange, dense, somewhat dated |
| **Tricount** (owned by bunq) | Simple, free group expenses | Free, simple, join by link, works in a browser | Now tied to the bunq bank: its help centre says new users get a bunq account at sign-up; reviewers report ads returning and export/search being lost; no in-app payment | Bright, friendly, card-based |
| **Splid** | No sign-up, works offline | No account needed, join by code or link, offline, multi-currency | Thin on history, explanation and wrap-up; paid tier for some features | Minimal and clean, dark accents |
| **Settle Up** | Powerful group ledger | Unlimited members, percentage and exact splits, editable exchange rates, offline entry | Ads on free tier, premium around $19/year; reported sync issues; heavier to set up | Plain Material Design |
| **Splitser, Spliit, Kittysplit and many newer apps** | "Splitwise without the cap" | Free, link-based, no account | Compete on price and feature parity only; little brand or trust | Varies; mostly generic |

What this tells us:

1. **The maths is solved.** Every app can split a bill. Nobody wins on that.
2. **The big opening is Splitwise's free-tier cap.** A trip produces 10+
   expenses a day; a 3–5 a day limit breaks exactly our use case.
3. **Joining friction decides adoption.** The apps people praise let friends
   join by link with no account.
4. **Nobody moves money, and users do not expect it.** Settling happens in
   Venmo, bank transfer or cash. A clear handoff matters more than in-app payment.
5. **Nobody owns "trust".** Competitors show balances. None make it their
   promise that every number is explainable and every change is visible.

## 4. Positioning

**Split the trip. Keep the friends.**

Updated after discussion: trust is the foundation, fun is the reason people
choose Ishiro, the way Strava won by making running social rather than by
tracking it first. The audience is friends aged 18–38, launching in North
America and the UK.

Foundation (trust):

- **Explain every number.** Tap any balance and see which expenses produce it.
- **Nothing changes silently.** Every add, edit and delete shows who and when.
- **A real ending.** The few payments needed, and a settled state when done.

Fun, on top:

- **Reactions and banter.** "Ada got dinner", with emoji reactions and one-line comments from the group.
- **The trip as a feed**, with optional photos, that people reopen later.
- **Whose turn.** A playful prompt for whoever has fronted the least.
- **Trip Wrapped.** A shareable recap with awards; this is the growth loop.

Rule: fun points at the trip and at whoever paid, never at whoever owes.

Riskiest assumptions: that this is enough to pull a group off the app one of
them already has, and that the playful tone suits every group (hence a
Playful/Plain setting per trip). Both should be tested with real groups early.

## 5. Scope

### Must have (version 1)

- Create a trip; add people by name.
- Invite by link or QR code; join **without creating an account**.
- Add an expense in under 10 seconds: amount, what for, who paid, who shares it.
- Splits: equally, among selected people only, or exact amounts.
- Live balances and "who pays whom" with the fewest payments.
- Balance breakdown: every balance traceable to its expenses.
- Activity log of every add, edit and delete.
- Record a repayment ("Ben paid Ada 90") and mark the trip settled.
- Emoji reactions and a one-line comment on an expense.
- Trips with several cities (stops), each with its own photo and spend.
- Expenses entered in the local currency and converted to the trip currency.
- Trip Wrapped: a shareable end-of-trip recap with awards.
- Works offline and syncs when back online.
- No daily limits, no ads.
- Delete my data / leave trip (required by both app stores).

### Nice to have (after version 1)

- Photo attached to an expense (receipt or moment).
- "Whose turn" prompt.
- Split by shares or percentages; itemised bills.
- Push notifications for new expenses and reminders to settle.
- Payment handoff: copy bank details, or deep links to payment apps.
- Trip summary export (PDF or image to post in the group chat).
- Spending by category; per-person totals.
- Optional sign-in (Apple, Google, email) to keep trips across devices.
- Web view of a trip for people who will not install anything.

### Not doing

- Moving money ourselves (brings payment regulation and card-data rules).
- Receipt scanning with automatic item recognition.
- Ongoing household or flatmate budgeting.
- Trip planning (itineraries, bookings).

## 6. Design identity

See [brand.md](brand.md) for the proposed brand: promise, voice, colour, type,
the stamp motif and the four signature moments. It replaces the calmer green
direction in the first draft of this brief.

## 7. Building simply for iOS and Android

- **One codebase:** React Native with Expo, in TypeScript. Both apps are built
  from the same code; Expo's cloud build service produces the iOS app without
  needing a Mac.
- **Shared design tokens** (colour, spacing, type) used by every component, so
  both platforms stay consistent.
- **Native where it matters:** system fonts, native navigation and gestures
  (iOS swipe back, Android back button), platform date pickers and share sheets.
  Same layout and brand on both; platform conventions for behaviour.
- **Small component set** built once and reused: button, amount input, person
  chip, expense row, balance row, sheet.
- **Avoid custom native code** for version 1, so the app stays on Expo's
  standard path and is easy to update.

## 8. Architecture (recommended)

- **App:** Expo (React Native, TypeScript), file-based navigation.
- **Money logic:** a pure, fully tested module with no dependency on the UI or
  the server. All amounts stored as whole minor units (cents), never decimals.
  A first version of this exists on the `core-ledger` branch.
- **On-device storage:** a local database (SQLite) is the source the UI reads
  from, so the app is instant and works offline.
- **Backend:** a hosted Postgres service with built-in sign-in, access rules
  and live updates (Supabase is my recommendation; Firebase is the main
  alternative). No custom servers to run.
- **Sync:** changes are recorded as an append-only list of events (expense
  added, edited, deleted; payment recorded). This makes offline sync simple
  (events merge rather than overwrite each other) and gives the activity log
  for free.
- **Identity:** anonymous account created silently on first open, so joining
  needs no sign-up; can be upgraded later to Apple, Google or email.
- **Environments:** separate development and production backends from day one.

## 9. Security and privacy

- **Collect very little:** a display name, and trip data. No bank details, no
  card numbers, no contacts upload. We do not move money.
- **Access by membership only:** database rules enforced on the server so a
  user can read or write a trip only if they are a member. The app is never
  trusted to enforce this.
- **Invite links:** long random tokens, revocable by the trip creator, with an
  expiry. Knowing a trip's ID alone grants nothing.
- **Server-side validation:** amounts are whole and non-negative, shares add up
  to the total, payer and participants are trip members.
- **History cannot be rewritten:** the event log is append-only; edits and
  deletes are new events, not erasures.
- **On the device:** sign-in tokens kept in the phone's secure storage
  (Keychain / Keystore); no secrets shipped in the app; all traffic over HTTPS.
- **User rights:** leave a trip, delete account and data, export a trip.
  Privacy policy and store data-safety forms prepared before submission.
- **Abuse limits:** rate limits on trip creation, joins and invites.

## 10. Project plan

No dates yet; phases run in order and each ends with something you review.

| Phase | What happens | You review |
|---|---|---|
| 0. Alignment | Agree this brief; answer section 11; write `CLAUDE.md` and `AGENTS.md` so every future session follows the same rules | The brief and the two files |
| 1. Validate | Show the concept to 5–8 people who organise group trips; confirm the trust angle matters and what they use today | Short findings note |
| 2. Design | Brand, tokens, five core screens in light and dark, clickable prototype | The prototype |
| 3. Foundation | Project set-up, design tokens in code, navigation, tests and checks running automatically | A running empty app on your phone |
| 4. Core on one phone | Trips, expenses, balances, breakdown, settle up, activity log — stored locally | Test build |
| 5. Sharing | Backend, invite links, join without account, offline sync, live updates | Test build used by a real group |
| 6. Beta | A real trip with real people; fix what confuses them; accessibility and security review | Beta feedback and fixes |
| 7. Launch | Store listings, privacy policy, submission to App Store and Google Play | Live apps |

## 11. Decisions needed from you

1. **Positioning:** do you agree with "the trip ledger nobody argues with"
   (explainable numbers, visible changes, a real ending) as the core promise?
2. **Target market first:** which country or region, and which currency
   matters most? This affects payment handoff and store listings.
3. **Sharing in version 1:** I recommend yes, with join-by-link and no
   account. The alternative is a faster single-phone first release.
4. **Backend:** Supabase (recommended) or Firebase.
5. **Business model:** free with no limits to start (recommended), with paid
   extras later such as receipts and export; or something else.
6. **Brand colour direction:** green/teal as proposed, or do you have existing
   brand ideas, a logo, or a meaning behind the name "Ishiro" the identity
   should reflect?
7. **Developer accounts:** Apple Developer ($99/year) and Google Play ($25
   once) are needed before beta; do you have them?

## Sources

Competitor information comes from these pages, several of which are published
by competing products and should be treated as indicative:

- https://tripprof.com/en/blog/best-apps-track-split-group-trip-expenses/
- https://getfinny.app/blog/best-splitwise-alternatives-2026
- https://getfinny.app/blog/splitwise-pricing-2026
- https://app-partly.web.app/en/blog/splitwise-pro-vs-free-2026/
- https://split-circle-landing.pages.dev/en/blog/splitwise-free-vs-pro
- https://help.tricount.com/articles/tricount-effortlessly-share-expenses-with-friends
- https://european-alternatives.eu/product/tricount
- https://www.kittysplit.com/en/tricount-alternative
- https://www.ionos.com/digitalguide/online-marketing/web-analytics/best-bill-splitting-apps/
- https://www.finanjo.com/personal-finance/splitwise-alternatives-apps-free-and-paid
- https://toomanyadapters.com/best-cost-splitting-apps/
- https://www.indiehackers.com/post/looking-for-a-no-stress-expense-splitting-app-for-groups-8ff3677152
- https://joingerald.com/learn/money-basics/splitwise-alternative
