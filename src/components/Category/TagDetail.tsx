import React from 'react';
import { Tag } from '../../model/tags';

export interface TagDetailProps {
  el: keyof JSX.IntrinsicElements,
  tag: Tag
};

const TagDetail: React.SFC<TagDetailProps> = ({
  el: El,
  tag
}) => (
  <El
    key={tag.id}
    className="c_tag-detail"
    >
    <input
      className="c_tag-detail__input"
      type="text"
      value={tag.value}
      />
  </El>
);

export default TagDetail;