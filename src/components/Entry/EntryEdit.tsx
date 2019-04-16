import React, { useEffect, useState } from 'react';
import { Entry } from '../../types/gql-schema';
import { Block } from '../../types/portable-text';

function blocksToText(
  blocks: Block[]
): string {
  return blocks
    .map(block => block
      .children
      .map(span => span.text)
      .join(' ')
    )
    .join('\n');
}

function textToBlocks(
  text: string
): Block[] {
  return text
    .split('\n')
    .map(p => ({
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: [],
          text: p
        }
      ],
      markDefs: []
    }));
}

export interface EntryEditProps {
  entries: Entry[],
  entryId: string,
  onDone: (entry: Entry) => void
};

const EntryEdit: React.SFC<EntryEditProps> = ({
  entries,
  entryId,
  onDone
}) => {
  const [entry, setEntry] = useState<Entry>();

  useEffect(() => {
    setEntry(
      entries.find(entry => entry.id === entryId)
    );
  }, [entryId, entries]);

  if(!entry) {
    return null;
  }

  const content: Block[] = JSON.parse(entry.content);

  return (
    <div className="c_entry-edit">
      <input
        onChange={event => setEntry({
          ...entry,
          title: event.currentTarget.value
        })}
        type="text"
        value={entry.title}
        />
      <textarea
        className="c_entry-edit__content"
        onChange={event => setEntry({
          ...entry,
          content: JSON.stringify(textToBlocks(event.target.value))
        })}
        value={blocksToText(content)}>
      </textarea>
      <div className="c_entry-edit__actions">
        <button
          className="c_entry-edit__action"
          onClick={() => onDone(entry)}
        >Done</button>
      </div>
    </div>
  );
};

export default EntryEdit;