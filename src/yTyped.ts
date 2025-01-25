import * as Y from "yjs";

// Very much incomplete improved typings for Y.js data, to allow modeling
// of deeply nested data structures with type safety.

export interface TypedYDoc<D> {
  getArray<K extends keyof D>(key: K): D[K] extends Y.Array<any> ? D[K] : never;
  getMap<K extends keyof D>(key: K): D[K] extends TypedYMap<any> ? D[K] : never;
  on(event: "update", handler: (update: Uint8Array) => void): void;
}

type MapObserver = (event: Y.YMapEvent<any>) => void;

type Entry<M> = {
  [K in keyof M]: [K, M[K]];
}[keyof M];

type DeletableAttributes<M> = {
  [K in keyof M as undefined extends M[K] ? K : never]: M[K];
}
type DeletableKey<M> = string extends keyof M ? string : keyof DeletableAttributes<M>

type ForEachFn<M> = (key: keyof M, value: M[keyof M], map: TypedYMap<M>) => void

export interface TypedYMap<M> {
  get<K extends keyof M>(key: K): string extends keyof M ? M[K] | undefined : M[K]
  set<K extends keyof M>(key: K, value: M[K]): void;

  clone(): TypedYMap<M>;
  // This could be improved to return a more specific type, but that would require changing Y.Array API as well, at least
  toJSON(): Record<string, any> 
  get size(): number;
  keys(): IterableIterator<keyof M>;
  values(): IterableIterator<M[keyof M]>;
  entries(): IterableIterator<Entry<M>>
  delete<K extends DeletableKey<M>>(key: K): void
  clear: keyof M extends DeletableKey<M> ? () => void : never;
  forEach(f: ForEachFn<M>): void;
  has<K extends keyof M>(key: K): boolean;
  
  [Symbol.iterator](): IterableIterator<Entry<M>>;

  // Type-safe observers would require a typesafe MapObserver which is not necessarily very useful
  observe(observer: MapObserver): void;
  unobserve(observer: MapObserver): void;
}

export function createTypedYMap<M>(data: M): TypedYMap<M> {
  const ymap = new Y.Map();
  for (const key in data) {
    ymap.set(key, data[key]);
  }
  return ymap as unknown as TypedYMap<M>;
}
