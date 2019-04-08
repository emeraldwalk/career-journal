import React, { useMemo, useState } from 'react';
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

import { remove, set } from '../../util/array';
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

  const category = useMemo(() => getCategory(
    data.listTags.items,
    categoryId
  ), []);

  const [pendingCreate, setPendingCreate] = useState([] as string[]);
  const [pendingDelete, setPendingDelete] = useState([] as string[]);
  const [pendingUpdate, setPendingUpdate] = useState([] as string[]);

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
    pendingDelete.forEach(id => {
      console.log('Delete tag:', id);
    });

    pendingCreate.forEach(id => {
      console.log('Create tag:', id);
    });

    pendingUpdate.forEach(id => {
      updateTag({
        variables: {
          input: pick(
            tags[id],
            'icon', 'id', 'parentId', 'value'
          )
        }
      }).then(({ data }) => data && setTag(data.updateTag));
    });

    setPendingCreate([]);
    setPendingDelete([]);
    setPendingUpdate([]);
  }

  console.groupCollapsed('Data');
  console.log('create:', pendingCreate);
  console.log('delete:', pendingDelete);
  console.log('update:', pendingUpdate);
  console.log('tags:', JSON.stringify(tags, undefined, '  '));
  console.groupEnd();

  function onAdd(tag: Tag) {
    setPendingCreate(
      set(
        pendingCreate,
        tag.id
      )
    );

    setTag(tag);
    setNewTag({
      ...tag,
      id: String(Number(tag.id) - 1),
      value: ''
    });
  }

  function onChange(tag: Tag) {
    const pendingCreateOrUpdate = pendingCreate.includes(tag.id)
      ? pendingCreate
      : pendingUpdate;

    set(pendingCreateOrUpdate, tag.id);
    setTag(tag);
  }

  function onDelete(tag: Tag) {
    setPendingCreate(
      remove(pendingCreate, tag.id)
    );
    setPendingUpdate(
      remove(pendingUpdate, tag.id)
    );
    setPendingDelete(
      set(pendingDelete, tag.id)
    );
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