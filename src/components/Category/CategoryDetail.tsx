import React from 'react';
import { Tag } from '../../model/tags';
import { default as TagDetail } from './TagDetail';

export interface CategoryDetailProps {
  category: Tag,
  tags: Tag[]
};

const CategoryDetail: React.SFC<CategoryDetailProps> = ({
  category,
  tags = []
}) => (
  <section
    className="c_category-detail"
    key={category.id}>
    <header className="c_category-detail__header">
      <input
        className="c_category-detail__header__input"
        type="text"
        value={category.value}/>
      <button>+</button>
    </header>
    <ul>
      {tags.map(tag => (
        <TagDetail
          el="li"
          tag={tag}
          />
      ))}
    </ul>
  </section>
);

export default CategoryDetail;