import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeBalances,
  splitEqually,
  suggestTransfers,
  totalSpent,
  type Trip,
} from "./ledger.ts";

const members = ["ada", "ben", "chi", "dan", "eve"].map((id) => ({ id, name: id }));
const ids = members.map((m) => m.id);

function trip(overrides: Partial<Trip> = {}): Trip {
  return { id: "t1", name: "Lagos", currency: "USD", members, expenses: [], payments: [], ...overrides };
}

function expense(id: string, paidBy: string, amountCents: number, among = ids) {
  return {
    id,
    description: id,
    amountCents,
    paidBy,
    shares: splitEqually(amountCents, among),
    createdAt: "2026-01-01T00:00:00Z",
  };
}

/** Apply transfers to balances and return the result. */
function settle(balances: Record<string, number>) {
  const after = { ...balances };
  for (const t of suggestTransfers(balances)) {
    after[t.from] += t.amountCents;
    after[t.to] -= t.amountCents;
  }
  return after;
}

test("splitEqually hands leftover cents to the first members", () => {
  assert.deepEqual(splitEqually(1000, ["a", "b", "c"]), { a: 334, b: 333, c: 333 });
  assert.deepEqual(splitEqually(0, ["a", "b"]), { a: 0, b: 0 });
});

test("splitEqually rejects bad input", () => {
  assert.throws(() => splitEqually(100, []));
  assert.throws(() => splitEqually(10.5, ["a"]));
  assert.throws(() => splitEqually(100, ["a", "a"]));
});

test("five people, three payers: balances and settlement", () => {
  const t = trip({
    expenses: [
      expense("tickets", "ada", 50000),
      expense("uber", "ben", 4000),
      expense("food", "chi", 11000),
    ],
  });
  assert.equal(totalSpent(t), 65000);

  // Each person's share is 13000.
  const balances = computeBalances(t);
  assert.deepEqual(balances, { ada: 37000, ben: -9000, chi: -2000, dan: -13000, eve: -13000 });

  const transfers = suggestTransfers(balances);
  assert.equal(transfers.length, 4);
  assert.ok(transfers.every((x) => x.to === "ada"));
  assert.ok(Object.values(settle(balances)).every((v) => v === 0));
});

test("expense shared by only some of the group", () => {
  const t = trip({ expenses: [expense("drinks", "dan", 3000, ["dan", "eve"])] });
  assert.deepEqual(computeBalances(t), { ada: 0, ben: 0, chi: 0, dan: 1500, eve: -1500 });
});

test("recorded payments reduce what is owed", () => {
  const t = trip({
    expenses: [expense("drinks", "dan", 3000, ["dan", "eve"])],
    payments: [{ id: "p1", from: "eve", to: "dan", amountCents: 1500, createdAt: "2026-01-02T00:00:00Z" }],
  });
  const balances = computeBalances(t);
  assert.ok(Object.values(balances).every((v) => v === 0));
  assert.deepEqual(suggestTransfers(balances), []);
});

test("uneven amounts still settle to exactly zero", () => {
  const t = trip({
    expenses: [expense("a", "ada", 1001), expense("b", "ben", 333, ["ada", "ben", "chi"]), expense("c", "eve", 7)],
  });
  const balances = computeBalances(t);
  assert.equal(Object.values(balances).reduce((a, b) => a + b, 0), 0);
  assert.ok(suggestTransfers(balances).length <= members.length - 1);
  assert.ok(Object.values(settle(balances)).every((v) => v === 0));
});

test("rejects expenses that do not add up or name outsiders", () => {
  const bad = { ...expense("x", "ada", 1000), shares: { ada: 400, ben: 500 } };
  assert.throws(() => computeBalances(trip({ expenses: [bad] })), /add up/);
  assert.throws(() => computeBalances(trip({ expenses: [expense("y", "zed", 100)] })), /not on this trip/);
});
