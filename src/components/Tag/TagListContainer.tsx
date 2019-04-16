import React from 'react';
import { Route, Router, TagList, TagListEdit } from '..';
import { useListTags } from '../../queries/list-tags';
import { getCategory } from '../../util/tags';

export interface TagListContainerProps {
  categoryId?: string,
  navigate: (path: string) => void
};

const TagListContainer: React.SFC<TagListContainerProps> = ({
  categoryId = '__ROOT__',
  navigate
}) => {
  const { data, error, loading, refetch } = useListTags({
    fetchPolicy: 'cache-and-network'
  });

  if(!data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const { parent, tags } = getCategory(
    data.listTags.items,
    categoryId
  );

  return (
    <div className="c_tag-list-container">
      <Router>
        <Route
          component={TagList}
          category={parent}
          path="/"
          tags={tags}
          />
        <Route
          component={TagListEdit}
          category={parent}
          onSave={() => {
            refetch();
            navigate!('.');
          }}
          path="edit"
          tags={tags}
          />
      </Router>
    </div>
  );
};

export default TagListContainer;