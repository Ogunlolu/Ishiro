# Ishiro — instructions for AI agents

Ishiro is a mobile app (iOS and Android) for friends on group trips: record
who paid for what, see who owes whom, and end the trip square. Promise:
**"Split the trip. Keep the friends."**

## Current stage: planning. Do not build yet.

No app code exists on `main`, by the owner's decision. Do not scaffold, install
dependencies or write app code until the owner explicitly asks for it. Twice
in the first session an agent started building unasked and had to stop.

## How to work with the owner

- Do exactly what was asked, then stop. Propose next steps; do not start them.
- Ask before anything that creates code, adds dependencies, or pushes to `main`.
- Explain in plain language; lead with the answer. The owner reviews work on
  a phone, mostly as visuals, and gives short, direct feedback.
- For design work, show options side by side and let the owner pick rather
  than guessing a single direction.
- Report honestly what was and was not done or checked.

## Read these first

- `docs/product-brief.md` — problem, market research, scope, architecture,
  security, plan, open decisions.
- `docs/brand.md` — approved brand direction and design rules.
- `docs/architecture.md` — proposed architecture and the way of working with
  agents (awaiting the owner's approval).
- Design canvas (private to the owner; ask them to share or export if you
  cannot open it): https://claude.ai/artifact/BS92wjiJh4MF1Gyx1mzChF

## Decided

- **Audience:** friends aged 18–38. Launch markets: North America and the UK.
- **Platforms:** iOS and Android from one codebase, React Native with Expo
  (TypeScript). The owner approved Expo; nothing is scaffolded on `main`.
- **Positioning:** trust is the foundation (every number explains itself,
  nothing changes silently, a clean ending); fun is why people choose it.
- **Brand:** see `docs/brand.md`. In short:
  - Black (`#111111`), white, neutral greys, and one accent, Guava pink
    (`#FF4F8B`), used only for the single main action per screen and for
    celebrations. Always black text on Guava.
  - Each trip's own photo is the only other colour.
  - Bricolage Grotesque for big numbers, headlines and the stamp; the
    phone's system font for everything else.
  - One job and one main button per screen. Little text. Lists divided by
    thin lines, not boxed cards. No arrows between people; write "Ben pays you".
  - Never red/green for balances, never colour-coded people, never shame
    whoever owes. Say "gets back" and "owes", not "debt".
- **Fun comes from:** emoji reactions and one-line banter on expenses, the
  "Closed clean" stamp when a trip is settled, and Trip Wrapped (a shareable
  recap with awards). A "say thanks" button was tried and rejected as lame.
- **Trips can span several cities:** swipeable photo card per city, a
  three-part progress bar (done / here now / upcoming) with spend per city,
  one balance for the whole trip, amounts shown as paid (€96) with the trip
  currency underneath ($104).
- **Nobody enters debts.** People record what they paid; the app works out
  balances and the fewest payments to settle.
- **The app does not move money.** People pay each other outside it and mark
  the payment done. Either person can mark it, with a visible log.
- **Sharing is in version 1:** join by link, no account.
- **Backend:** Supabase.
- **Business model:** free. It is a for-fun project; keep running costs near
  zero and add no paid service without asking.
- **Trip cover photos:** from the camera roll and a stock library (both).
- **Accounts:** the owner has an Apple Developer account.

## Still open (ask the owner; do not assume)

- Trip cover photos: the owner said "both, but…" and the condition was cut
  off. Ask what it was.
- Logo symbol and app icon; trademark and store-name checks for "Ishiro".
  The owner will come back to this later.
- Whether the owner has a Google Play account (Apple Developer: yes).
- A web address for invite links (see `docs/architecture.md`, section 8).
- Whether to review or rewrite the `core-ledger` money logic.
- `docs/architecture.md` is proposed, not yet approved by the owner.

## Engineering rules for when building starts

- Money is always whole minor units (cents) as integers. Never floats.
- Money logic is pure, UI-free and fully tested. A first version lives on the
  `core-ledger` branch (`src/core/ledger.ts`); it was written before the owner
  asked for it and has not been reviewed or merged.
- History is append-only: edits and deletes are new events, never erasures.
- Access to a trip is enforced on the server by membership, never by the app.
- Collect as little personal data as possible; no bank or card details.
- Follow the Expo docs for the installed SDK version rather than memory; use
  `npx expo install` for dependencies.
- Accessibility baseline: text contrast at least 4.5:1, touch targets at
  least 44 pt, large system text supported, no meaning by colour alone.

## Git

- Work on a branch; do not push to `main` or open a pull request unless asked.
- Branches: `main` (docs only), `core-ledger` (unreviewed money logic).
