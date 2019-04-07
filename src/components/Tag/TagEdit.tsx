import React from 'react';
import { Tag } from '../../model/tags';

export interface TagEditProps {
  action: string,
  el: keyof JSX.IntrinsicElements
  tag: Tag,
  onAction: () => void,
  onChange: (value: string) => void
};

const TagEdit: React.SFC<TagEditProps> = ({
  action,
  el: El,
  onAction,
  onChange,
  tag
}) => (
  <El
    className="c_tag-edit">
    <button
      className="c_tag-edit__action"
      onClick={onAction}
    >{action}</button>
    <input
      className="c_tag-edit__input"
      onChange={event => onChange(event.currentTarget.value)}
      type="text" value={tag.value}
      />
  </El>
);

export default TagEdit;