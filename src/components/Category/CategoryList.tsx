import React from 'react';
import { Tag } from '../../model/tags';
import { Dict } from '../../model/common';
import { CategoryDetail } from '.';

export interface CategoryListProps {
  tags: Dict<Tag[]>
};

const CategoryList: React.SFC<CategoryListProps> = ({
  tags
}) => (
  <div className="c_category-list">
    <header className="c_category-list__header">
      <span>Categories</span>
      <button className="c_category-list__btn-add">+</button>
    </header>
    {tags['__ROOT__'].map(category => (
      <CategoryDetail
        key={category.id}
        category={category}
        tags={tags[category.id]}
      />
    ))}
  </div>
);

export default CategoryList;