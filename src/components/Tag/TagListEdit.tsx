import React, { useEffect, useState } from 'react';
import { TagEdit } from '..';
import { Dict, pick, values } from '../../util/common';
import { getCategory } from '../../util/tags';
import { Tag } from '../../gql-schema';
import { useCreateTag, useDeleteTag, useListTags, useUpdateTag } from '../../queries/hooks';
import { usePending, useStateDict } from '../../util/hooks';

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
  const { pending, resetPending, setPending } = usePending();
  const [newTag, setNewTag] = useState<Tag>({ id: '-1', parentId: categoryId, value: '' });
  const [categoryName, setCategoryName] = useState('');

  const {
    remove: removeTag,
    set: setTag,
    setAll: setTags,
    state: tags,
  } = useStateDict<Tag>({});

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
              setTag(
                data.createTag.id,
                data.createTag
              );
            }
          });
          break;

        case 'DELETE':
          if(isNaN(Number(id))) {
            deleteTag({
              variables: {
                input: {
                  id: id,
                  parentId: categoryId
                }
              }
            });
          }
          removeTag(id);
          break;

        case 'UPDATE':
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
              setTag(
                data.createTag.id,
                data.createTag
              );
            }
          });
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
          values(tags).filter(tag => pending[tag.id] !== 'DELETE').map(tag => (
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