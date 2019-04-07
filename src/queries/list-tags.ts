import gql from 'graphql-tag';
import { TagConnection } from '../gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';

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