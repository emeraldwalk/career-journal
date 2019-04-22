import React from 'react';
import { Route, Router, TagList, TagListEdit } from '..';
import { useListTags } from '../../queries/list-tags';
import { useCreateTag } from '../../queries/create-tag';
import { filterDict, toDict } from '../../util/common';

export interface TagListContainerProps {
  categoryId?: string,
  navigate: (path: string) => void
};

const TagListContainer: React.SFC<TagListContainerProps> = ({
  categoryId = '__ROOT__',
  navigate
}) => {
  const { data, error, refetch } = useListTags({
    fetchPolicy: 'cache-and-network'
  });

  const createTag = useCreateTag();

  if(!data || !data.listTags) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const allTags = toDict(data.listTags.items, 'id');
  const parent = allTags[categoryId] || { id: '__ROOT__', parentId: '', value: 'Categories' };
  const tags = filterDict(allTags, tag => tag.parentId === categoryId);

  return (
    <div className="c_tag-list-container">
      <Router>
        <Route
          component={TagList}
          category={parent}
          path="/"
          onAdd={(value: string) => {
            createTag({
              parentId: categoryId,
              value
            })
            .then(() => {
              refetch();
            });
          }}
          tags={tags}
          />
        <Route
          component={TagListEdit}
          category={parent}
          onSave={() => {
            refetch()
              .then(() => navigate('.'));
          }}
          path="/edit"
          tags={tags}
          />
      </Router>
    </div>
  );
};

export default TagListContainer;