import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { TagEdit } from '..';
import { Dict, isNewId, values } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../gql-schema';
import { useTagMutations } from '../../queries/mutate-tags';
import { usePending } from '../../util/hooks';

export interface TagListEditProps {
  category: Tag,
  onSave: () => void,
  tags: Dict<Tag>
};

export interface TagListEditState {
  category: ReturnType<typeof getCategory>,
  dirty: Dict<Tag>,
}

const TagListEdit: React.SFC<TagListEditProps> = ({
  category,
  onSave,
  tags: tagsInit
}) => {
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
  const [newTag, setNewTag] = useState<Tag>({ id: '-1', parentId: category.id, value: '' });
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    setCategoryName(category.value);
    setTags(tagsInit);
  }, []);

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

  function onDone() {
    const mutations = Object.keys(pending).map(id => {
      switch(pending[id]) {
        case 'CREATE':
          return createTag(tags[id]);

        case 'DELETE':
          if(isNewId(id)) {
            return Promise.resolve();
          }
          else {
            return deleteTag({
              id,
              parentId: category.id
            });
          }

        case 'UPDATE':
          return updateTag(tags[id]);

        default:
          throw `Unexpected pending state: '${pending[id]}'`;
      }
    });

    resetPending();

    Promise.all(
      mutations
    )
    .then(() => onSave());
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
        <Link to={`..`}>Cancel</Link>
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