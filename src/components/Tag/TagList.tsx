import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { LIST_TAGS_QUERY, ListTagsData, ListTagsVariables } from '../../queries/tags';
import { getCategory } from '../../model/tags';

export interface TagListProps {
  categoryId?: string
};

const TagList: React.SFC<TagListProps> = ({
  categoryId = '__ROOT__'
}) => {
  const { data, error, loading } = useQuery<ListTagsData, ListTagsVariables>(LIST_TAGS_QUERY);

  if(loading || !data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const { parent, tags } = getCategory(
    data.listTags.items,
    categoryId
  )

  return (
    <div className="c_tag-list">
      <header className="c_tag-list__header">{parent.value}</header>
      <ul>
        {
          tags.map(tag => <li key={tag.id}>{tag.value}</li>)
        }
      </ul>
    </div>
  );
}

export default TagList;