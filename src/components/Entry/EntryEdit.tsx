import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { Entry } from '../../types/gql-schema';
import { Block } from '../../types/portable-text';
import { Extend } from '../../util/common';
import { Link } from '@reach/router';
import { TagSelector } from '../Tag';
import { TagCategory } from '../../util/tags';

export interface EntryEditProps {
  categories: TagCategory[],
  entries: Entry[],
  entryId: string,
  onDone: (entry: Extend<Entry, { content: Block[] }>) => void
};

const EntryEdit: React.SFC<EntryEditProps> = ({
  categories,
  entries,
  entryId,
  onDone
}) => {
  const [entry, setEntry] = useState<Extend<Entry, { content: Block[] }>>();

  useEffect(() => {
    const entry = parseEntry(
      entries,
      entryId
    );

    if(entry) {
      setEntry(
        entry
      );
    }
  }, [entryId, entries]);

  if(!entry) {
    return null;
  }

  return (
    <div className="c_entry-edit">
      {entry.date.substr(5)}
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
          content: textToBlocks(event.target.value)
        })}
        value={blocksToText(entry.content)}>
      </textarea>
      <div className="c_entry-edit__tag-selectors">
        <div className="c_entry-edit__tag-selector-labels">
          {
            categories.map(({ parent }) => (
              <span key={parent.id}>{parent.value}</span>
            ))
          }
        </div>
        <div className="c_entry-edit__tag-selector-inputs">
          {
            categories.map(({ parent, tags }) => (
              <TagSelector
                key={parent.id}
                onChange={value => setEntry(
                  updateTags(entry, value, { parent, tags })
                )}
                selected={getSelectedCategory(entry, { parent, tags })}
                tags={Object.keys(tags).map(id => tags[id])}
              />
            ))
          }
        </div>
      </div>
      <div className="c_entry-edit__actions">
        <Link
          className="c_entry-edit__action"
          to="/"
        >Cancel</Link>
        <button
          className="c_entry-edit__action"
          onClick={
            () => {
              onDone(entry);
              navigate('/');
            }
          }
        >Done</button>
      </div>
    </div>
  );
};

export default EntryEdit;

function blocksToText(
  blocks: Block[]
): string {
  return blocks
    .map(block => block
      .children
      .map(span => span.text == null ? '' : span.text)
      .join(' ')
    )
    .join('\n');
}

function getSelectedCategory(
  entry: Entry,
  { tags }: TagCategory
): string {
  return entry.tags.filter(id => Object.keys(tags).indexOf(id) > -1)[0];
}

function parseEntry(
  entries: Entry[],
  entryId: string
) {
  const entry = entries.find(entry => entry.id === entryId);
  if(entry) {
    return {
      ...entry,
      content: JSON.parse(entry.content) as Block[]
    };
  }
}

function updateTags(
  entry: Entry,
  id: string,
  category: TagCategory
): Entry {
  if(!id) {
    const selectedId = getSelectedCategory(
      entry,
      category
    );
    const i = entry.tags.indexOf(selectedId);
    if(i > -1) {
      return {
        ...entry,
        tags: [
          ...entry.tags.slice(0, i),
          ...entry.tags.slice(i + 1)
        ]
      };
    }
  }
  else if(entry.tags.indexOf(id) < 0) {
    return {
      ...entry,
      tags: [...entry.tags, id]
    }
  }

  return entry
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
          text: p === '' ? null : p
        }
      ],
      markDefs: []
    } as Block));
}