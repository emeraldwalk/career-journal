import gql from "graphql-tag";
import { FetchPolicy } from "apollo-client";
import { useQuery } from "react-apollo-hooks";
import { ENTRY_FIELDS_FRAGMENT, TAG_FIELDS_FRAGMENT } from "./fragments";
import { EntryConnection, TagConnection } from "../types/gql-schema";

export interface ListAllVariables {
}

export interface ListAllData {
  listEntries: EntryConnection,
  listTags: TagConnection
}

export const LIST_ALL_QUERY = gql`
  query ListAll {
    listEntries {
      items {
        ...EntryFields
      }
      nextToken
    }
    listTags {
      items {
        ...TagFields
      }
      nextToken
    }
  }
  ${ENTRY_FIELDS_FRAGMENT}
  ${TAG_FIELDS_FRAGMENT}
`;

export function useListAll({ fetchPolicy }: {
  fetchPolicy: FetchPolicy
}) {
  return useQuery<
    ListAllData,
    ListAllVariables
  >(LIST_ALL_QUERY, {
    fetchPolicy
  })
}