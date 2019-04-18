import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { Tag, UpdateTagInput } from '../types/gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';
import { Extend, omit } from '../util/common';

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

export function useUpdateTag() {
  const doUpdateTag = useMutation<
    UpdateTagData,
    UpdateTagVariables
  >(UPDATE_TAG_MUTATION);

  return function updateTag(
    input: Extend<Tag, { __typename?: string }>
  ) {
    return doUpdateTag({
      variables: {
        input: omit(input, '__typename')
      }
    });
  }
}