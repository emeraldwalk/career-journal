import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { Dict, isNewId, values } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../types/gql-schema';
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
    deleteTag,
    setTag,
    setAllTags,
    tags,
    updateTag
  } = useTagMutations();
  const { pending, removePending, resetPending, setPending } = usePending();
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    setCategoryName(category.value);
    setAllTags(tagsInit);
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
        case 'DELETE':
          if(isNewId(id)) {
            return Promise.resolve(undefined);
          }
          else {
            return deleteTag({
              id,
              parentId: category.id
            });
          }

        case 'UPDATE':
          return updateTag(tags[id]);

        // NOTE: 'CREATE' is now handled by TagList
        case 'CREATE':
        default:
          throw `Unexpected pending state: '${pending[id]}'`;
      }
    });

    Promise.all<any>(
      mutations
    )
    .then(() => resetPending())
    .then(() => onSave());
  }

  function onChange(tag: Tag) {
    setPending(tag.id, 'UPDATE');
    setTag(tag.id, tag);
  }

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">
        <span>{categoryName}</span>
        <Link to={`..`}>Cancel</Link>
        <button
          className="c_tag-list-edit__action"
          disabled={Object.keys(pending).filter(key => pending[key] === 'UPDATE').length === 0}
          onClick={onDone}
        >Done</button>
      </header>
      <ul>
        {
          values(tags).map(tag => (
            <li key={tag.id}>
              <input
                checked={pending[tag.id] === 'DELETE'}
                onChange={event => {
                  if(event.currentTarget.checked) {
                    setPending(tag.id, 'DELETE');
                  }
                  else {
                    removePending(tag.id);
                  }
                }}
                type="checkbox"
              />
              <input
                type="text"
                onChange={({ currentTarget: { value } }) => onChange({
                  ...tag,
                  value
                })}
                value={tag.value}
                />
            </li>
          ))
        }
      </ul>
      <button
        className="c_tag-list-edit__action"
        disabled={Object.keys(pending).filter(key => pending[key] === 'DELETE').length === 0}
        onClick={onDone}
      >Delete</button>
    </div>
  );
}

export default TagListEdit;