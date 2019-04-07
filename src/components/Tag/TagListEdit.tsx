import React, { useState } from 'react';
import { TagEdit } from '..';
import { useMutation, useQuery } from 'react-apollo-hooks';
import {
  LIST_TAGS_QUERY,
  ListTagsData,
  ListTagsVariables,
  UPDATE_TAG_MUTATION,
  UpdateTagData,
  UpdateTagVariables
} from '../../queries/tags';
import { Dict, pick } from '../../model/common';
import { getCategory, Tag } from '../../model/tags';

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
  const updateTag = useMutation<UpdateTagData, UpdateTagVariables>(UPDATE_TAG_MUTATION);

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

  const [dirty, setDirty] = useState(
    {} as Dict<boolean>
  );

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

  function flagAsDirty(id: string) {
    setDirty({
      ...dirty,
      [id]: true
    });
  }

  function saveDirty() {
    Object
      .keys(dirty)
      .forEach(id => {
        if(/^-/.test(id)) {
          console.log('Create tag:, id');
        }
        else {
          updateTag({
            variables: {
              input: pick(
                tags[id],
                'icon', 'id', 'parentId', 'value'
              )
            }
          });
        }
    });

    setDirty({});
  }

  /** Set a tag in the tags dictionary. */
  function setTag(tag: Tag) {
    setTags({
      ...tags,
      [tag.id]: tag
    });
  }

  console.log('category', category);
  console.log('tags:', tags);
  console.log('dirty:', dirty);

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">
        <span>{category.parent.value}</span>
        <button disabled={Object.keys(dirty).length === 0} onClick={saveDirty}>Done</button>
      </header>
      <ul>
        {
          Object.keys(tags).map(id => (
            <TagEdit
              key={id}
              action="X"
              el="li"
              tag={tags[id]}
              onAction={console.log}
              onChange={value => {
                flagAsDirty(id);
                setTag({
                  ...tags[id],
                  value
                });
              }}
            />
          ))
        }
        <TagEdit
          action="+"
          el="li"
          tag={newTag}
          onAction={() => {
            flagAsDirty(newTag.id);
            setTag(newTag);
            setNewTag({
              ...newTag,
              id: String(Number(newTag.id) - 1),
              value: ''
            })
          }}
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