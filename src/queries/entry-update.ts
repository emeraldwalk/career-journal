import gql from "graphql-tag";
import { Entry, UpdateEntryInput } from "../types/gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from "./fragments";
import { useMutation } from "react-apollo-hooks";
import { Extend, omit } from "../util/common";
import { Block } from "../types/portable-text";

export interface UpdateEntryVariables {
  input: UpdateEntryInput
}

export interface UpdateEntryData {
  updateEntry: Entry
}

export const UPDATE_ENTRY_MUTATION = gql`
  mutation UpdateEntryMutation($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      ...EntryFields
    }
  }
  ${ENTRY_FIELDS_FRAGMENT}
`;

export function useUpdateEntry() {
  const doUpdateEntry = useMutation<
    UpdateEntryData,
    UpdateEntryVariables
  >(UPDATE_ENTRY_MUTATION);

  return function updateEntry(
    input: Extend<UpdateEntryInput, { __typename?: string, content: Block[] }>
  ) {
    doUpdateEntry({
      variables: {
        input: {
          ...omit(input, '__typename'),
          content: JSON.stringify(input.content),
        },
      }
    });
  }
}