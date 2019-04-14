import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { TagConnection } from '../gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions'

export interface ListTagsVariables {
}

export interface ListTagsData {
  listTags: TagConnection
}

export const LIST_TAGS_QUERY = gql`
  query ListTags {
    listTags {
      items {
        ...TagFields
      }
      nextToken
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;

export function useListTags({ fetchPolicy }: {
  fetchPolicy: FetchPolicy
}) {
  return useQuery<
    ListTagsData,
    ListTagsVariables
  >(LIST_TAGS_QUERY, {
    fetchPolicy
  });
}