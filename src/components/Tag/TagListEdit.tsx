import React, { useEffect, useState } from 'react';
import { TagEdit } from '..';
import { remove, set } from '../../util/array';
import { Dict, pick, values } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../gql-schema';
import { useCreateTag, useDeleteTag, useListTags, useUpdateTag } from '../../queries/hooks';

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
  const { data, error, loading } = useListTags();

  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const updateTag = useUpdateTag();

  const [pendingCreate, setPendingCreate] = useState([] as string[]);
  const [pendingDelete, setPendingDelete] = useState([] as string[]);
  const [pendingUpdate, setPendingUpdate] = useState([] as string[]);
  const [newTag, setNewTag] = useState<Tag>({ id: '-1', parentId: categoryId, value: '' });
  const [categoryName, setCategoryName] = useState('');
  const [tags, setTags] = useState<Dict<Tag>>({});

  useEffect(() => {
    if(data) {
      const { parent, tags: tagsInit } = getCategory(
        data.listTags.items,
        categoryId
      );
      setCategoryName(parent.value);
      setTags(tagsInit);
    }
  }, [data]);

  // console.groupCollapsed('Tags');
  // function tagLog(tag: Tag) {
  //   return `${tag.id}: ${tag.value} ${tag.parentId}`;
  // }
  // function tagsLog(label: string, tags: Tag[] = []) {
  //   console.log(label, JSON.stringify(
  //     tags.filter(tag => tag.parentId === '__ROOT__').map(tagLog),
  //     undefined,
  //     '  '
  //   ));
  // }
  // tagsLog('items:', data && data.listTags.items);
  // tagsLog('tags:', values(tags));
  // console.groupEnd();

  if(loading || !data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  /** Set a tag in the tags dictionary. */
  function setTag(tag: Tag) {
    setTags({
      ...tags,
      [tag.id]: tag
    });
  }

  function onDone() {
    pendingDelete.forEach(id => {
      deleteTag({
        variables: {
          input: {
            id: id,
            parentId: categoryId
          }
        }
      });
    });

    pendingCreate.forEach(id => {
      createTag({
        variables: {
          input: pick(
            tags[id],
            'icon', 'parentId', 'value'
          )
        }
      })
      .then(({ data }) => {
        if(data) {
          delete tags[id];
          setTag(data.createTag);
        }
      });
    });

    pendingUpdate.forEach(id => {
      updateTag({
        variables: {
          input: pick(
            tags[id],
            'icon', 'id', 'parentId', 'value'
          )
        }
      })
      .then(({ data }) => {
        if(data) {
          setTag(data.createTag);
        }
      });
    });

    setPendingCreate([]);
    setPendingDelete([]);
    setPendingUpdate([]);
  }

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
    if(pendingCreate.includes(tag.id)) {
      setPendingCreate(
        set(
          pendingCreate, tag.id
        )
      );
    }
    else {
      setPendingUpdate(
        set(
          pendingUpdate, tag.id
        )
      );
    }

    setTag(tag);
  }

  function onDelete(tag: Tag) {
    setPendingCreate(
      remove(pendingCreate, tag.id)
    );
    setPendingUpdate(
      remove(pendingUpdate, tag.id)
    );
    if(isNaN(Number(tag.id))) {
      setPendingDelete(
        set(pendingDelete, tag.id)
      );
    }

    delete tags[tag.id];
    setTags({
      ...tags
    });
  }

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">
        <span>{categoryName}</span>
        <button
          disabled={pendingCreate.length === 0 && pendingDelete.length === 0 && pendingUpdate.length === 0}
          onClick={onDone}
        >Done</button>
      </header>
      <ul>
        {
          values(tags).map(tag => (
            <TagEdit
              key={tag.id}
              action="X"
              el="li"
              tag={tag}
              onAction={() => onDelete(tag)}
              onChange={value => onChange({
                ...tag,
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