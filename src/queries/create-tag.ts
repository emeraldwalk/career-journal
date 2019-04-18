import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { CreateTagInput, Tag } from '../types/gql-schema';
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
  const doCreateTag = useMutation<
    CreateTagData,
    CreateTagVariables
  >(CREATE_TAG_MUTATION);

  return function createTag(
    tag: CreateTagInput
  ) {
    return doCreateTag({
      variables: {
        input: tag
      }
    })
    .then<Tag>(({ data }) => {
      return data!.createTag;
    });
  };
}