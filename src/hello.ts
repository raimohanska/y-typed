import * as Y from "yjs";
import { createTypedYMap, TypedYDoc, TypedYMap } from "./yTyped";

// The Board defines the structure of our document
interface Board {
  // Attributes are defined as a structured map, where a title is required
  attributes: TypedYMap<{
    title: string;
  }>;
  // The items array here is just an example of using Y.Array, which is defined in Y.js. It contains structured Items though.
  items: Y.Array<TypedYMap<Item>>;
  // This is an id-to-item map, where the key is a string and the value is a structured Item
  itemsById: TypedYMap<Record<string, TypedYMap<Item>>>
}

// The interface for our items on the board
interface Item {
  id: number;
  title: string;
  tasks: Y.Array<string>
}

// TODO This is not a typesafe way to create a TypedYDoc, as we have to initialize the required attributes manually.
const board = new Y.Doc() as TypedYDoc<Board>;
board.getMap("attributes").set("title", "My Board");

// Items are structured data, and the createTypedYMap helper requires valid data
const item: TypedYMap<Item> = createTypedYMap<Item>({ id: 1, title: "My Item", tasks: new Y.Array() });

// Arrays are just Y.Arrays
board.getArray("items").push([item]);

// All maps can be represented as TypedYMap and are typesafe
board.getMap("itemsById").set("1", item);

// TODO: this should be a nullable value, because items are a string key map
const foundItem = board.getMap("itemsById").get("1")