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
  description?: string | undefined
  tasks: Y.Array<string>
}

// TODO Can we make a typesafe document constructor?
const board = new Y.Doc() as TypedYDoc<Board>;
board.getMap("attributes").set("title", "My Board");

// Items are structured data, and the createTypedYMap helper requires valid data
const item: TypedYMap<Item> = createTypedYMap<Item>({ id: 1, title: "My Item", tasks: new Y.Array() });

// Attributes of structurally typed maps are always present, so the result is not nullable
const title: string = item.get("title")

// Arrays are just Y.Arrays
board.getArray("items").push([item]);

const itemsById: TypedYMap<Record<string, TypedYMap<Item>>> = board.getMap("itemsById")
// Maps that have plain `string` as keys accept any string, of course
itemsById.set("1", item);

// Maps that have plain `string` as keys return nullable values from `get`
const foundItem: TypedYMap<Item> | undefined = itemsById.get("1")

// Does not compile, because title is a required field
// DOESN'T COMPILE: item.delete("title");

// Optional field can be deleted
item.delete("description");

// Maps that have non-optional keys cannot be cleared.
// DOESN'T COMPILE: item.clear()

// Maps that have plain `string` as keys (or maps with only optional keys) can be cleared.
itemsById.clear()

itemsById.forEach((key: string, value: TypedYMap<Item>, itemsMap) => {})