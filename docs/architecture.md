# Ishiro — architecture and how we work with agents

Status: approved by the owner, 18 Nov 2026. Nothing here is built, and
nothing gets built until the owner asks.

Goals, in the owner's words: scalable, cost-effective, fun, one app for both
iPhone and Android. It is a free, for-fun project, so the plan favours
"nothing to run, nothing to pay" over anything clever.

## 1. The shape in one picture

```
 Phone (iOS + Android, one Expo codebase)
 ┌──────────────────────────────────────────┐
 │ Screens            what you see          │
 │ Money logic        pure maths, tested    │
 │ Local database     SQLite, works offline │
 │ Sync               sends/receives events │
 └───────────────────┬──────────────────────┘
                     │ HTTPS
 Supabase (one hosted service, no servers of our own)
 ┌───────────────────┴──────────────────────┐
 │ Sign-in      silent anonymous account    │
 │ Postgres     trips, members, event log   │
 │ Access rules members only, on the server │
 │ Live updates one channel per trip        │
 │ Storage      trip cover photos           │
 └──────────────────────────────────────────┘
```

## 2. The four parts of the app

| Part | Folder | Job | Rule |
|---|---|---|---|
| Money logic | `src/core/` | Balances, splits, fewest payments, currency conversion | Pure functions, integer cents, no UI, no network, fully tested |
| Data | `src/data/` | Local SQLite database and sync with Supabase | The only code that talks to the database or the network |
| Design system | `src/ui/` | Tokens (colour, type, spacing) and the small component set | The only place colours and fonts are defined |
| Screens | `app/` | One file per screen, Expo's file-based navigation | One job and one main button per screen; no maths in screens |

Plus `supabase/` for the database: tables, access rules and their tests, all
as files in the repo so every change is reviewable and repeatable.

These borders are what let several agents work without breaking each other's
work: a task belongs to one folder, and the folders only meet at small,
typed joins.

## 3. How data works

**Everything is an event.** Nothing is ever overwritten. Adding, editing or
deleting an expense, recording a payment, reacting with an emoji: each is a
new row in one append-only list per trip. Balances are worked out from that
list by the money logic.

This one choice gives four things for free:

- the activity log ("who changed what, when");
- "explain this number" (every balance traces back to its events);
- offline use (the phone queues events and sends them later);
- no merge conflicts (two people's events are both kept, in order).

**Sync, kept deliberately simple:**

1. Each event gets its ID on the phone, so sending it twice is harmless.
2. The phone saves the event locally first; the screen updates instantly.
3. When online, the phone sends unsent events, then asks the server for
   "everything after the last one I have".
4. Live updates only nudge the phone to do step 3; they carry no data that
   matters, so a missed nudge loses nothing.

No paid sync product is needed for this.

**Joining by link.** An invite is a long random token. Opening the link
creates a silent anonymous account and adds that person to the trip on the
server. Knowing a trip's ID alone grants nothing.

**Photos.** Cover photos from the camera roll or a stock library (both, as
decided). Photos are shrunk on the phone before upload, so storage stays tiny.

**Fun features cost nothing to run.** Reactions and banter are ordinary
events. The "Closed clean" stamp and Trip Wrapped are drawn on the phone and
shared as an image; no server work.

## 4. Why this scales

- A trip is small: a handful of people and a few hundred events. The app only
  ever loads the trips you are in, so a million trips cost each phone nothing
  extra.
- Postgres handles this shape easily for a very long time. If a trip ever
  grows huge, the server can store a saved balance so phones need not replay
  the whole list. Not built until it is needed.
- Access rules live on the server and are tested, so growth does not open
  holes.
- No servers of our own means nothing to patch, restart or watch at night.

## 5. What it costs

Prices change; these are to be confirmed on the providers' pricing pages at
set-up, not relied on from this document.

| Item | Expected cost |
|---|---|
| Apple Developer account | Already owned (about $99 a year) |
| Google Play account | About $25 once; needed only when we ship Android |
| Supabase | Free tier to start |
| Expo cloud builds and updates | Free tier to start |
| Automatic checks on GitHub | Free tier |
| A web address for invite links | Roughly $10–15 a year (see open questions) |

How we keep it there:

- Develop against a Supabase copy running locally; one hosted project for the
  real thing.
- Build a new installable app only when native parts change; ship ordinary
  changes as over-the-air updates.
- Set spending caps and alerts on every service on day one.
- No paid services added without the owner's say-so.

Known catch to check at set-up: free Supabase projects have been paused after
a period of no activity. Fine during building; before real groups depend on
it we either keep it active or move to the paid tier.

## 6. How we work with agents

The owner decides and reviews; agents build in small slices. The risk with
agents is fast, confident work that drifts. The process below is built to
stop that.

**One slice at a time.** Each task is one thin, visible piece ("add an
expense, saved on the phone"), small enough to review on a phone in a few
minutes. One slice, one branch, one pull request.

**Every slice follows the same loop:**

1. **Brief** — the owner asks in a sentence or two. The agent replies with
   what it will do and what it will not, and waits for a yes.
2. **Build** — on a branch, inside the folder the slice belongs to.
3. **Check itself** — tests, type checks and lint must pass. The agent runs
   the app and takes screenshots in light and dark.
4. **Second pair of eyes** — a fresh agent reviews the change without the
   builder's reasoning, so it does not just agree with it.
5. **Show** — the owner gets screenshots and a plain summary: what was done,
   what was not, what was checked and how.
6. **Owner approves** — only then does it merge to `main`.

**Guardrails that do not depend on an agent behaving:**

- `main` is protected: nothing merges unless the automatic checks pass.
- Money logic has its own test suite, including random-input tests ("balances
  always add up to zero", "nobody ends up owing a fraction of a cent").
- Access rules have tests that try to read another group's trip and must fail.
- No new dependency, paid service or database change without asking.
- Secrets never go in the repo.
- A security review before sharing goes live, and again before launch.

**Memory between sessions.** Agents forget everything between sessions, so
the repo is the memory:

- `AGENTS.md` — rules and decisions; updated the moment a decision is made.
- `docs/` — brief, brand, this plan.
- A short "now / next / later" list in the repo, so any agent can pick up
  where the last one stopped.

**Working in parallel, when it helps.** Because the four parts have clear
borders, two agents can safely work at once on, say, money logic and a
screen. We only do this when slices do not touch the same folder. Default is
one at a time; it is cheaper and easier to review.

**What agents cannot do from the cloud.** They can run tests and take
screenshots of the app in a browser-based preview, but cannot run a real
iPhone. Real-phone checks are the owner's: scan a QR code with Expo Go, or
install a test build through TestFlight.

## 7. Build order

Same phases as the product brief, cut into slices. Each line ends with
something to look at.

1. **Foundation** — empty app on your phone, design tokens, checks running.
2. **Money logic** — review and merge the existing `core-ledger` work.
3. **One phone** — create trip, add expense, balances, explain a number,
   settle up, activity log. All stored locally.
4. **Fun** — reactions, the stamp, Trip Wrapped.
5. **Sharing** — Supabase, invite links, sync, live updates.
6. **Multi-city and currencies** — stops, photos, conversion.
7. **Beta, then launch.**

Sharing comes after one-phone on purpose: the event list is designed for
sync from the start, so adding it later is not a rewrite, and the owner gets
something usable much sooner.

## 8. Open questions

- **Invite links:** the owner will buy a web address; which one is not
  chosen yet.
- **Google Play account:** none yet; the owner will set it up before Android
  ships.
- **`core-ledger`:** decided — keep it as the starting point; review and
  extend it when building starts.
