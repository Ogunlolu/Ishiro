// Core money logic for Ishiro. Pure functions, no UI or storage dependencies.
// All amounts are integer minor units (cents) so sums never drift.

export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amountCents: number;
  /** Member who paid the bill. */
  paidBy: string;
  /** What each participating member owes for this expense. Must sum to amountCents. */
  shares: Record<string, number>;
  createdAt: string;
}

/** A repayment from one member to another, recorded when someone settles up. */
export interface Payment {
  id: string;
  from: string;
  to: string;
  amountCents: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  /** ISO 4217 code, e.g. "USD". One currency per trip for now. */
  currency: string;
  members: Member[];
  expenses: Expense[];
  payments: Payment[];
}

/** Suggested transfer that moves the group towards everyone being even. */
export interface Transfer {
  from: string;
  to: string;
  amountCents: number;
}

function assertCents(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative whole number of cents, got ${value}`);
  }
}

/**
 * Split an amount equally between members. Leftover cents go one each to the
 * first members in the list, so the shares always add up to the full amount.
 */
export function splitEqually(amountCents: number, memberIds: string[]): Record<string, number> {
  assertCents(amountCents, "amountCents");
  if (memberIds.length === 0) throw new Error("An expense needs at least one participant");
  if (new Set(memberIds).size !== memberIds.length) throw new Error("Duplicate participant");

  const base = Math.floor(amountCents / memberIds.length);
  const remainder = amountCents - base * memberIds.length;
  const shares: Record<string, number> = {};
  memberIds.forEach((id, i) => {
    shares[id] = base + (i < remainder ? 1 : 0);
  });
  return shares;
}

/** Check an expense is internally consistent and only references trip members. */
export function validateExpense(expense: Expense, members: Member[]): void {
  const ids = new Set(members.map((m) => m.id));
  assertCents(expense.amountCents, "amountCents");
  if (!ids.has(expense.paidBy)) throw new Error(`Payer ${expense.paidBy} is not on this trip`);

  let total = 0;
  for (const [id, share] of Object.entries(expense.shares)) {
    if (!ids.has(id)) throw new Error(`Participant ${id} is not on this trip`);
    assertCents(share, `share for ${id}`);
    total += share;
  }
  if (total !== expense.amountCents) {
    throw new Error(`Shares add up to ${total} but the expense is ${expense.amountCents}`);
  }
}

/**
 * Net position of every member. Positive means the group owes them money,
 * negative means they owe the group. The values always sum to zero.
 */
export function computeBalances(trip: Trip): Record<string, number> {
  const balances: Record<string, number> = {};
  for (const m of trip.members) balances[m.id] = 0;

  for (const e of trip.expenses) {
    validateExpense(e, trip.members);
    balances[e.paidBy] += e.amountCents;
    for (const [id, share] of Object.entries(e.shares)) balances[id] -= share;
  }

  for (const p of trip.payments) {
    assertCents(p.amountCents, "payment amount");
    if (!(p.from in balances) || !(p.to in balances)) {
      throw new Error("Payment references someone who is not on this trip");
    }
    balances[p.from] += p.amountCents;
    balances[p.to] -= p.amountCents;
  }

  return balances;
}

/**
 * Turn balances into a short list of "X pays Y" transfers that settles
 * everyone. Repeatedly matches the biggest debtor with the biggest creditor,
 * which needs at most (members - 1) transfers.
 */
export function suggestTransfers(balances: Record<string, number>): Transfer[] {
  const sum = Object.values(balances).reduce((a, b) => a + b, 0);
  if (sum !== 0) throw new Error(`Balances must sum to zero, got ${sum}`);

  // Sort by amount, then id, so the result is stable for the same input.
  const bySize = (a: [string, number], b: [string, number]) =>
    b[1] - a[1] || a[0].localeCompare(b[0]);
  const creditors = Object.entries(balances).filter(([, v]) => v > 0).sort(bySize);
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < 0)
    .map(([id, v]): [string, number] => [id, -v])
    .sort(bySize);

  const transfers: Transfer[] = [];
  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    const amountCents = Math.min(creditor[1], debtor[1]);
    transfers.push({ from: debtor[0], to: creditor[0], amountCents });

    creditor[1] -= amountCents;
    debtor[1] -= amountCents;
    if (creditor[1] === 0) creditors.shift();
    if (debtor[1] === 0) debtors.shift();
    creditors.sort(bySize);
    debtors.sort(bySize);
  }
  return transfers;
}

/** Total spent on the trip, excluding repayments between members. */
export function totalSpent(trip: Trip): number {
  return trip.expenses.reduce((sum, e) => sum + e.amountCents, 0);
}
