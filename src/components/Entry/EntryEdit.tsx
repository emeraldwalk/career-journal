import React from 'react';
import { Entry } from '../../types/gql-schema';
import { Block } from '../../types/portable-text';

export interface EntryEditProps {
  entries: Entry[],
  entryId: string
};

const EntryEdit: React.SFC<EntryEditProps> = ({
  entries,
  entryId
}) => {
  const entry = entries.find(entry => entry.id === entryId);

  if(!entry) {
    return null;
  }

  const content: Block[] = JSON.parse(entry.content);

  return (
    <div>
      Edit
      <textarea value={content[0].children[0].text}>
      </textarea>
    </div>
  );
};

export default EntryEdit;