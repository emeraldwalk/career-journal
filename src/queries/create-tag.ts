import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { CreateTagInput, Tag } from '../gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';

export interface CreateTagVariables {
  input: CreateTagInput
}

export interface CreateTagData {
  createTag: Tag
}

export const CREATE_TAG_MUTATION = gql`
  mutation CreateTagMutation($input: CreateTagInput!) {
    createTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;

export function useCreateTag() {
  return useMutation<
    CreateTagData,
    CreateTagVariables
  >(CREATE_TAG_MUTATION);
}