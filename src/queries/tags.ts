import gql from 'graphql-tag';
import { TagConnection, UpdateTagInput } from '../model/tags';

export interface ListTagsVariables {
}

export interface ListTagsData {
  listTags: TagConnection
}

export const TAG_FIELDS_FRAGMENT = gql`
  fragment TagFields on Tag {
    id
    icon
    parentId
    value
  }
`;

export const LIST_TAGS_QUERY = gql`
  query ListTags {
    listTags {
      items {
        ...TagFields
      }
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;

export interface UpdateTagVariables {
  input: UpdateTagInput
}

export interface UpdateTagData {
}

export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTagMutation($input: UpdateTagInput!) {
    updateTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;