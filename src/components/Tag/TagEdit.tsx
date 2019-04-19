import React from 'react';
import { Tag } from '../../types/gql-schema';

export interface TagEditProps {
  action: string,
  actionEnabled: boolean,
  el: keyof JSX.IntrinsicElements
  value: string,
  onAction: () => void,
  onChange: (value: string) => void
};

const TagEdit: React.SFC<TagEditProps> = ({
  action,
  actionEnabled,
  el: El,
  onAction,
  onChange,
  value
}) => (
  <El
    className="c_tag-edit">
    <button
      className="c_tag-edit__action"
      disabled={!actionEnabled}
      onClick={onAction}
    >{action}</button>
    <input
      className="c_tag-edit__input"
      onChange={event => onChange(event.currentTarget.value)}
      type="text" value={value}
      />
  </El>
);

export default TagEdit;