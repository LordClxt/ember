/** JSON shape of `T`: `JSON.stringify` turns `Date` fields into ISO strings. */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};

/**
 * `true` when the JSON of `Entity` has exactly the shape of `Contract`
 * (a type from `@ember/contracts`), `false` otherwise.
 */
export type SerializedAs<Entity, Contract> = [Serialized<Entity>] extends [
  Contract,
]
  ? [Contract] extends [Serialized<Entity>]
    ? true
    : false
  : false;

/** Compile-time assertion: only accepts `true`. */
export type AssertTrue<T extends true> = T;
