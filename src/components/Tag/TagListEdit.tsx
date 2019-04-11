import React, { useEffect, useState } from 'react';
import { TagEdit } from '..';
import { Dict, isNewId, values } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../gql-schema';
import { useListTags, useTagMutations } from '../../queries/hooks';
import { usePending } from '../../util/hooks';

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
  const {
    createTag,
    deleteTag,
    removeTag,
    setTag,
    setTags,
    tags,
    updateTag
  } = useTagMutations();
  const { pending, resetPending, setPending } = usePending();
  const [newTag, setNewTag] = useState<Tag>({ id: '-1', parentId: categoryId, value: '' });
  const [categoryName, setCategoryName] = useState('');

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
  // console.log(pending);
  // console.groupEnd();

  if(loading || !data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  function onDone() {
    Object.keys(pending).forEach(id => {
      switch(pending[id]) {
        case 'CREATE':
          createTag(tags[id]);
          break;

        case 'DELETE':
          if(!isNewId(id)) {
            deleteTag({
              id,
              parentId: categoryId
            });
          }
          break;

        case 'UPDATE':
          updateTag(tags[id]);
          break;

        default:
          throw `Unexpected pending state: '${pending[id]}'`;
      }
    });

    resetPending();
  }

  function onAdd(tag: Tag) {
    setPending(tag.id, 'CREATE');
    setTag(tag.id, tag);
    setNewTag({
      ...tag,
      id: String(Number(tag.id) - 1),
      value: ''
    });
  }

  function onChange(tag: Tag) {
    setPending(tag.id, 'UPDATE');
    setTag(tag.id, tag);
  }

  function onDelete(tag: Tag) {
    setPending(tag.id, 'DELETE');
    removeTag(tag.id);
  }

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">
        <span>{categoryName}</span>
        <button
          disabled={Object.keys(pending).length === 0}
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