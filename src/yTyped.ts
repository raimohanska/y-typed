import * as Y from "yjs";

// Very much incomplete improved typings for Y.js data, to allow modeling
// of deeply nested data structures with type safety.

export interface TypedYDoc<D> {
  getArray<K extends keyof D>(key: K): D[K] extends Y.Array<any> ? D[K] : never;
  getMap<K extends keyof D>(key: K): D[K] extends TypedYMap<any> ? D[K] : never;
  on(event: "update", handler: (update: Uint8Array) => void): void;
}

type MapObserver = (event: Y.YMapEvent<any>) => void;

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export interface TypedYMap<M> {
  get<K extends keyof M>(key: K): M[K];
  set<K extends keyof M>(key: K, value: M[K]): void;

  clone(): TypedYMap<M>;
  // TODO toJSON(): Flattened<M>
  get size(): number;
  keys(): IterableIterator<keyof M>;
  values(): IterableIterator<M[keyof M]>;
  entries(): IterableIterator<Entry<M>>
  
  // TODO forEach(f: (arg0: MapType, arg1: string, arg2: YMap<MapType>) => void): void;
  // TODO clear only if applicable clear(): void;  
  // TODO delete only if applicable: delete(key: string): void;
  
  has<K extends keyof M>(key: K): boolean;
  

  [Symbol.iterator](): IterableIterator<Entry<M>>;

  // TODO: more typesafe observers?
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
