import React from 'react';
import ListTags, { ListTagsQuery } from '../../queries/ListTags';
import { Dict } from '../../model/common';
import { Tag } from '../../model/tags';
import { CategoryList } from '.';

/**
 * Create a map of Tags to parent ids.
 */
function createTagMap(tags: Tag[]) {
  return tags.reduce((memo, tag) => {
    const tags = memo[tag.parentId] || [];
    return {
      ...memo,
      [tag.parentId]: tags.concat(tag)
    };
  }, {} as Dict<Tag[]>);
}

export interface CategoryListConnectedProps {
};

const CategoryListConnected: React.SFC<CategoryListConnectedProps> = ({}) => (
    <ListTagsQuery query={ListTags}>
      {({ data, loading }) => {
        if(loading || !data) {
          return <div>Loading...</div>;
        }

        const tags = createTagMap(data.listTags.items);

        return (
          <CategoryList
            tags={tags}
          />
        );
      }}
    </ListTagsQuery>
);

export default CategoryListConnected;