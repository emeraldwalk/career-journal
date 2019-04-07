import React, { useState } from 'react';
import { TagEdit } from '..';
import { useMutation, useQuery } from 'react-apollo-hooks';

import {
  LIST_TAGS_QUERY,
  ListTagsData,
  ListTagsVariables
} from '../../queries/list-tags';

import {
  UPDATE_TAG_MUTATION,
  UpdateTagData,
  UpdateTagVariables
} from '../../queries/update-tag';

import { default as Cache } from '../../util/cache';
import { Dict, pick } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../gql-schema';

export interface TagListEditProps {
  categoryId?: string
};

export interface TagListEditState {
  category: ReturnType<typeof getCategory>,
  dirty: Dict<Tag>
}

const TagListEdit: React.SFC<TagListEditProps> = ({
  categoryId = '__ROOT__'
}) => {
  const { data, error, loading } = useQuery<ListTagsData, ListTagsVariables>(LIST_TAGS_QUERY);
  const updateTag = useMutation<
    UpdateTagData,
    UpdateTagVariables
  >(UPDATE_TAG_MUTATION);

  if(loading || !data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const category = getCategory(
    data.listTags.items,
    categoryId
  );

  const [pendingCreate] = useState(new Cache<Tag>());
  const [pendingDelete] = useState(new Cache<Tag>());
  const [pendingUpdate] = useState(new Cache<Tag>());

  const [newTag, setNewTag] = useState(
    {
      id: '-1',
      parentId: category.parent.id,
      value: ''
    }
  );

  const [tags, setTags] = useState(
    category.tags
  );

  function deleteTag(tag: Tag) {
    delete tags[tag.id];
    setTags({
      ...tags
    });
  }

  /** Set a tag in the tags dictionary. */
  function setTag(tag: Tag) {
    console.log('setTag:', tag);
    setTags({
      ...tags,
      [tag.id]: tag
    });
  }

  function onDone() {
    pendingDelete.getAll().forEach(tag => {
      console.log('Delete tag:', tag.id);
    });

    pendingCreate.getAll().forEach(tag => {
      console.log('Create tag:', tag.id);
    });

    pendingUpdate.getAll().forEach(tag => {
      updateTag({
        variables: {
          input: pick(
            tag,
            'icon', 'id', 'parentId', 'value'
          )
        }
      }).then(({ data }) => data && setTag(data.updateTag));
    });

    pendingCreate.clear();
    pendingDelete.clear();
    pendingUpdate.clear();
  }

  console.groupCollapsed('Data');
  console.log('create:', pendingCreate.getAll());
  console.log('delete:', pendingDelete.getAll());
  console.log('update:', pendingUpdate.getAll());
  console.log('tags:', JSON.stringify(tags, undefined, '  '));
  console.groupEnd();

  function onAdd(tag: Tag) {
    pendingCreate.set(tag.id, tag);
    setTag(tag);
    setNewTag({
      ...tag,
      id: String(Number(tag.id) - 1),
      value: ''
    });
  }

  function onChange(tag: Tag) {
    const cache = pendingCreate.has(tag.id)
      ? pendingCreate
      : pendingUpdate;

    cache.set(tag.id, tag);
    setTag(tag);
  }

  function onDelete(tag: Tag) {
    pendingCreate.delete(tag.id);
    pendingUpdate.delete(tag.id);
    pendingDelete.set(tag.id, tag);
    deleteTag(tag);
  }

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">
        <span>{category.parent.value}</span>
        <button
          disabled={pendingCreate.length === 0 && pendingDelete.length === 0 && pendingUpdate.length === 0}
          onClick={onDone}
        >Done</button>
      </header>
      <ul>
        {
          Object.keys(tags).map(id => (
            <TagEdit
              key={id}
              action="X"
              el="li"
              tag={tags[id]}
              onAction={() => onDelete(tags[id])}
              onChange={value => onChange({
                ...tags[id],
                value
              })}
            />
          ))
        }
        <TagEdit
          action="+"
          el="li"
          tag={newTag}
          onAction={() => onAdd(newTag)}
          onChange={value => {
            setNewTag({
              ...newTag,
              value
            });
          }}
        />
      </ul>
    </div>
  );
}

export default TagListEdit;