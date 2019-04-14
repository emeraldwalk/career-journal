import { CreateTagInput, DeleteTagInput, Tag, UpdateTagInput } from '../gql-schema';
import { pick } from '../util/common';
import { useStateDict } from '../util/hooks';
import { useCreateTag } from './create-tag';
import { useDeleteTag } from './delete-tag';
import { useUpdateTag } from './update-tag';

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