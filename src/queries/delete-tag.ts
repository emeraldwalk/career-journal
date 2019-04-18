import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { DeleteTagInput, Tag } from '../types/gql-schema';
import { TAG_FIELDS_FRAGMENT } from './fragments';

export interface DeleteTagVariables {
  input: DeleteTagInput
}

export interface DeleteTagData {
  deleteTag: Tag
}

export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTagMutation($input: DeleteTagInput!) {
    deleteTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`;

export function useDeleteTag() {
  const doDeleteTag = useMutation<
    DeleteTagData,
    DeleteTagVariables
  >(DELETE_TAG_MUTATION);

  return function deleteTag({
    id,
    parentId
  }: { id: string, parentId: string }): Promise<Tag> {
    return doDeleteTag({
      variables: {
        input: {
          id,
          parentId
        }
      }
    })
    .then<Tag>(({ data }) => {
      return data!.deleteTag;
    });
  };
}