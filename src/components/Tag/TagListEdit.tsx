import React, { useReducer } from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import {
  LIST_TAGS_QUERY,
  ListTagsData,
  ListTagsVariables,
  UPDATE_TAG_MUTATION,
  UpdateTagData,
  UpdateTagVariables
} from '../../queries/tags';
import { Dict } from '../../model/common';
import { getCategory, Tag } from '../../model/tags';

export interface TagListEditProps {
  categoryId?: string
};

export interface TagListEditState {
  category: ReturnType<typeof getCategory>,
  dirty: Dict<Tag>
}

function categoryReducer(
  state: TagListEditState,
  action: { type: 'ClearDirty' } | { type: 'UpdateValue', payload: { id: string, value: string } }
): TagListEditState {
  switch(action.type) {
    case 'ClearDirty':
      return {
        ...state,
        dirty: {}
      };

    case 'UpdateValue':
      const tagIndex = state.category.tags.findIndex(tag => tag.id === action.payload.id);
      const tag = {
        ...state.category.tags[tagIndex],
        value: action.payload.value
      };
      const tags = [
        ...state.category.tags.slice(0, tagIndex),
        tag,
        ...state.category.tags.slice(tagIndex + 1)
      ];

      return {
        category: {
          ...state.category,
          tags
        },
        dirty: {
          ...state.dirty,
          [tag.id]: {
            ...tag
          }
        }
      };

    default:
      return state;
  }
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

  const [state, dispatch] = useReducer(
    categoryReducer,
    {
      category: getCategory(
        data.listTags.items,
        categoryId
      ),
      dirty: {}
    }
  );

  console.log(state);

  const { parent, tags } = state.category;

  return (
    <div className="c_tag-list-edit">
      <header className="c_tag-list-edit__header">{parent.value}</header>
      <ul>
        {
          tags.map(tag => (
            <li key={tag.id}>
              <input
                onBlur={() => {
                  Object.keys(state.dirty).forEach(id => updateTag({
                    variables: {
                      input: {
                        icon: state.dirty[id].icon,
                        id: state.dirty[id].id,
                        parentId: state.dirty[id].parentId,
                        value: state.dirty[id].value
                      }
                    }
                  }));
                  dispatch({ type: 'ClearDirty' });
                }}
                onChange={event => dispatch({
                  type: 'UpdateValue',
                  payload: {
                    id: tag.id,
                    value: event.currentTarget.value
                  }
                })}
                type="text" value={tag.value}
                />
              {/* <button onClick={() => updateTag({
                variables: {
                  input: {
                    icon: tag.icon,
                    id: tag.id,
                    parentId: tag.parentId,
                    value: 'Testing 2'
                  }
                }
              })}>+</button> */}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default TagListEdit;