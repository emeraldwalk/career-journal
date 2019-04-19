import { Extend } from "./common";
import { CreateEntryInput } from "../types/gql-schema";
import { Block } from "../types/portable-text";

export function newEntry(): Extend<CreateEntryInput, { content: Block[] }> {
  return {
    content: [
      {
        _type: 'block',
        markDefs: [],
        children: [
          {
            _type: 'span',
            text: null,
            marks: []
          }
        ]
      }
    ],
    date: new Date().toISOString().substr(0, 10),
    tags: [],
    title: '[New Entry]'
  };
}