# Ishiro

A mobile app (iOS and Android) that keeps group trips fair: record who paid for
what during the trip, see who owes whom at any moment, and settle up with the
fewest payments afterwards.

## Status

Only the core money logic exists so far. The app itself is not scaffolded yet.

- `src/core/ledger.ts` — trips, expenses, repayments, per-person balances and
  suggested settle-up transfers. Amounts are whole cents.
- `src/core/ledger.test.ts` — tests for the above.

## Running the tests

Needs Node 22.18 or newer; no dependencies to install.

```bash
node --test src/core/ledger.test.ts
```
