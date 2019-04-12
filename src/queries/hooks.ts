import { useMutation, useQuery } from 'react-apollo-hooks';
import { CreateTagInput, DeleteTagInput, Tag, UpdateTagInput } from '../gql-schema';
import { pick } from '../util/common';
import { useStateDict } from '../util/hooks';

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
    fetchPolicy: 'cache-and-network'
  });
}

export function useUpdateTag() {
  return useMutation<
    UpdateTagData,
    UpdateTagVariables
  >(UPDATE_TAG_MUTATION);
}

export function useTagMutations() {
  const createTagInit = useCreateTag();
  const deleteTagInit = useDeleteTag();
  const updateTagInit = useUpdateTag();

  const {
    remove: removeTag,
    set: setTag,
    setAll: setTags,
    state: tags,
  } = useStateDict<Tag>({});

  function createTag(input: CreateTagInput & { id: string }) {
    return createTagInit({
      variables: {
        input: pick(
          input,
          'icon', 'parentId', 'value'
        )
      }
    })
    .then(result => {
      const { data } = result;
      if(data) {
        // replace item with temporary id with new item
        removeTag(input.id);
        setTag(
          data.createTag.id,
          data.createTag
        );
      }
      return data;
    });
  }

  function deleteTag(input: DeleteTagInput) {
    return deleteTagInit({
      variables: {
        input
      }
    });
  }

  function updateTag(input: UpdateTagInput) {
    return updateTagInit({
      variables: {
        input: pick(
          input,
          'icon', 'id', 'parentId', 'value'
        )
      }
    })
    .then(result => {
      const { data } = result;
      if(data) {
        setTag(
          data.updateTag.id,
          data.updateTag
        );
      }
      return result;
    });
  }

  return {
    createTag,
    deleteTag,
    removeTag,
    setTag,
    setTags,
    tags,
    updateTag
  };
}