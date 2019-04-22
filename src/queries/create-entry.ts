import gql from "graphql-tag";
import { CreateEntryInput, Entry } from "../types/gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from "./fragments";
import { useMutation } from "react-apollo-hooks";
import { Extend, Dict } from "../util/common";
import { Block } from "../types/portable-text";

export interface CreateEntryVariables {
  input: CreateEntryInput
}

export interface CreateEntryData {
  createEntry: Entry
}

export const CREATE_ENTRY_MUTATION = gql`
  mutation CreateEntryMutation($input: CreateEntryInput!) {
    createEntry(input: $input) {
      ...EntryFields
    }
  }
  ${ENTRY_FIELDS_FRAGMENT}
`;

export function useCreateEntry() {
  const doCreateEntry = useMutation<
    CreateEntryData,
    CreateEntryVariables
  >(CREATE_ENTRY_MUTATION);

  return function createEntry(
    {
      categoryTags,
      content,
      ...rest
    }: Extend<CreateEntryInput, { categoryTags: Dict<string>, content: Block[] }>
  ): Promise<Entry> {
    return doCreateEntry({
      variables: {
        input: {
          ...rest,
          categoryTags: JSON.stringify(categoryTags),
          content: JSON.stringify(content)
        }
      }
    })
    .then<Entry>(({ data }) => {
      return data!.createEntry;
    });
  };
}