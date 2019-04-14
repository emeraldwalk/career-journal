import gql from "graphql-tag";
import { CreateEntryInput, Entry } from "../gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from "./fragments";
import { useMutation } from "react-apollo-hooks";

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

  return function createEntry(input: CreateEntryInput) {
    return doCreateEntry({
      variables: {
        input
      }
    })
  };
}