import assert from 'node:assert';
import { flux } from './Flux';
import { fluxProp } from './fluxProp';

type User = { name: string; age: number };

// --- correctness ---------------------------------------------------------

// get() before any on() — pipe must lazily init from source
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  assert.strictEqual(age$.get(), 30, 'get() before on() should read source value');
}

// on() should also receive the initial value
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  let received: number | undefined;
  age$.on((v) => (received = v), undefined, true);
  assert.strictEqual(received, 30, 'on(..., isRepeat=true) should emit initial value');
}

// source change should propagate to the prop pipe, with or without a live subscriber
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  age$.get(); // init without subscribing
  user$.set({ name: 'Bob', age: 31 });
  assert.strictEqual(age$.get(), 31, 'prop pipe should reflect source updates even without on()');
}

// source change pushes to a live listener too (not just pull via get())
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  const seen: number[] = [];
  // Pipe.on() always resyncs once on first subscribe (even without isRepeat),
  // so the current value (30) is emitted before any source change.
  age$.on((v) => seen.push(v));
  user$.set({ name: 'Bob', age: 31 });
  user$.set({ name: 'Bob', age: 32 });
  assert.deepStrictEqual(seen, [30, 31, 32], 'live subscriber should receive each source update');
}

// setting the prop pipe should update the source object
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  age$.set(40);
  assert.strictEqual(user$.get().age, 40, 'setting prop pipe should update source');
  assert.strictEqual(user$.get().name, 'Bob', 'setting one prop should not clobber sibling props');
}

// setting the prop to its current value should not allocate a new source object
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const before = user$.get();
  const age$ = fluxProp(user$, 'age');
  age$.set(30);
  assert.strictEqual(user$.get(), before, 'no-op set should not replace the source object');
}

// clean() normalizes both directions
{
  const user$ = flux<User>({ name: '  Bob  ', age: 30 });
  const name$ = fluxProp(user$, 'name', (v) => v.trim());
  assert.strictEqual(name$.get(), 'Bob', 'clean() should normalize the read value');
  name$.set('  Alice  ');
  assert.strictEqual(user$.get().name, 'Alice', 'clean() should normalize the written value');
}

// two independent props on the same source stay decoupled
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const name$ = fluxProp(user$, 'name');
  const age$ = fluxProp(user$, 'age');
  name$.set('Alice');
  assert.strictEqual(age$.get(), 30, 'unrelated prop pipe should be unaffected');
  assert.strictEqual(user$.get().name, 'Alice');
}

// chained fluxProp / map, resolved purely via get() with no on() anywhere in the chain
{
  type Nested = { user: User };
  const state$ = flux<Nested>({ user: { name: 'bob', age: 30 } });
  const user$ = fluxProp(state$, 'user');
  const upperName$ = fluxProp(user$, 'name').map((s) => s.toUpperCase());
  assert.strictEqual(upperName$.get(), 'BOB');
  state$.set({ user: { name: 'alice', age: 31 } });
  assert.strictEqual(upperName$.get(), 'ALICE', 'chained pipes should resync through every level');
}

// unsubscribing (off) falls back to pull-on-get again
{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  const listener = (_v: number) => {};
  age$.on(listener);
  user$.set({ name: 'Bob', age: 31 });
  assert.strictEqual(age$.get(), 31);
  age$.off(listener);
  user$.set({ name: 'Bob', age: 32 });
  assert.strictEqual(age$.get(), 32, 'after off(), get() should still pull fresh values from source');
}

console.log('All fluxProp correctness tests passed');

// --- performance -----------------------------------------------------------
// fluxProp/map now re-run onSync on every get() while unsubscribed ("pull" mode,
// see Flux.ts Pipe.pull). This section quantifies that cost and confirms a live
// subscriber (push mode) stays cheap regardless of how often get() is called.

const bench = (label: string, iterations: number, fn: () => void) => {
  // warm up (JIT)
  for (let i = 0; i < Math.min(1000, iterations); i++) fn();
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) fn();
  const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
  console.log(
    `${label}: ${ms.toFixed(2)}ms total, ${((ms * 1_000_000) / iterations).toFixed(1)}ns/op (${iterations} ops)`
  );
  return ms;
};

const N = 1_000_000;

{
  const user$ = flux<User>({ name: 'Bob', age: 30 });
  const age$ = fluxProp(user$, 'age');
  age$.get(); // init, no subscriber => stays in pull mode
  const pullMs = bench('pull mode: get() with no subscriber', N, () => age$.get());

  const user2$ = flux<User>({ name: 'Bob', age: 30 });
  const age2$ = fluxProp(user2$, 'age');
  age2$.on(() => {}); // live subscriber => push mode, get() should just read the cache
  const pushMs = bench('push mode: get() with a live subscriber', N, () => age2$.get());

  console.log(
    `pull/push ratio: ${(pullMs / pushMs).toFixed(1)}x (pull mode re-derives from source on every read)`
  );
  assert.ok(pushMs < pullMs, 'a subscribed pipe should be cheaper to read than an unsubscribed one');
}

console.log('All fluxProp performance checks passed');
