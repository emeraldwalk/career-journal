import gql from "graphql-tag";
import { FetchPolicy } from "apollo-client";
import { useQuery } from "react-apollo-hooks";
import { EntryConnection } from "../types/gql-schema";
import { ENTRY_FIELDS_FRAGMENT } from "./fragments";

export interface ListEntriesVariables {
}

export interface ListEntriesData {
  listEntries: EntryConnection
}

export const LIST_ENTRIES_QUERY = gql`
  query ListEntries {
    listEntries {
      items {
        ...EntryFields
      }
      nextToken
    }
  }
  ${ENTRY_FIELDS_FRAGMENT}
`;

export function useListEntries({ fetchPolicy }: {
  fetchPolicy: FetchPolicy
}) {
  return useQuery<
    ListEntriesData,
    ListEntriesVariables
  >(LIST_ENTRIES_QUERY, {
    fetchPolicy
  })
}