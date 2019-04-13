import React from 'react';
import { Link } from '@reach/router';
import { values, Dict } from '../../util/common';
import { Tag } from '../../gql-schema';

export interface TagListProps {
  category: Tag,
  tags: Dict<Tag>
};

const TagList: React.SFC<TagListProps> = ({
  category,
  tags
}) => {
  return (
    <div className="c_tag-list">
      <header className="c_tag-list__header">
        <span>
          {category.parentId && <span><Link to={`../${category.parentId}`}>Categories</Link> > </span>}
          {category.value}
        </span>
        <Link to={`./edit`}>Edit</Link>
      </header>
      <ul>
        {
          values(tags).map(tag => (
            <li key={tag.id}>{
              category.id === '__ROOT__'
                ? <Link
                    className="c_tag-list__link"
                    to={`../${tag.id}`}
                  >{tag.value}</Link>
                : <span>{tag.value}</span>
            }</li>
          ))
        }
      </ul>
    </div>
  );
}

export default TagList;