import gql from 'graphql-tag';
import { Tag, UpdateTagInput } from '../gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';

export interface UpdateTagVariables {
  input: UpdateTagInput
}

export interface UpdateTagData {
  updateTag: Tag
}

export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTagMutation($input: UpdateTagInput!) {
    updateTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;