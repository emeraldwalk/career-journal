import { useMutation, useQuery } from 'react-apollo-hooks';

import {
  CREATE_TAG_MUTATION,
  CreateTagData,
  CreateTagVariables
} from './create-tag';

import {
  DELETE_TAG_MUTATION,
  DeleteTagData,
  DeleteTagVariables
} from './delete-tag';

import {
  LIST_TAGS_QUERY,
  ListTagsData,
  ListTagsVariables
} from './list-tags';

import {
  UPDATE_TAG_MUTATION,
  UpdateTagData,
  UpdateTagVariables
} from './update-tag';

export function useCreateTag() {
  return useMutation<
    CreateTagData,
    CreateTagVariables
  >(CREATE_TAG_MUTATION);
}

export function useDeleteTag() {
  return useMutation<
    DeleteTagData,
    DeleteTagVariables
  >(DELETE_TAG_MUTATION);
}

export function useListTags() {
  return useQuery<
    ListTagsData,
    ListTagsVariables
  >(LIST_TAGS_QUERY, {
    fetchPolicy: 'network-only'
  });
}

export function useUpdateTag() {
  return useMutation<
    UpdateTagData,
    UpdateTagVariables
  >(UPDATE_TAG_MUTATION);
}