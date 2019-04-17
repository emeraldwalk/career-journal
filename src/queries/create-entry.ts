import gql from "graphql-tag";
import { CreateEntryInput, Entry } from "../types/gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from "./fragments";
import { useMutation } from "react-apollo-hooks";
import { Extend } from "../util/common";
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
      content,
      ...rest
    }: Extend<CreateEntryInput, { content: Block[] }>
  ) {
    return doCreateEntry({
      variables: {
        input: {
          ...rest,
          content: JSON.stringify(content)
        }
      }
    })
    .then<Entry>(({ data }) => {
      return data!.createEntry;
    });
  };
}