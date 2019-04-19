import gql from 'graphql-tag';
import { DeleteEntryInput, Entry, EntryConnection } from "../types/gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from './fragments';
import { useMutation } from 'react-apollo-hooks';

export interface DeleteEntryVariables {
  input: DeleteEntryInput
}

export interface DeleteEntryData {
  deleteEntry: Entry
}

export const DELETE_ENTRY_MUTATION = gql`
  mutation DeleteEntryMutation($input: DeleteEntryInput!) {
    deleteEntry(input: $input) {
      ...EntryFields
    }
  }
  ${ENTRY_FIELDS_FRAGMENT}
`;

export function useDeleteEntry() {
  const doDeleteEntry = useMutation<
    DeleteEntryData,
    DeleteEntryVariables
  >(DELETE_ENTRY_MUTATION);

  return function deleteEntry(id: string): Promise<Entry> {
    return doDeleteEntry({
      variables: {
        input: {
          id
        }
      }
    })
    .then<Entry>(({ data }) => {
      return data!.deleteEntry;
    });
  };
}