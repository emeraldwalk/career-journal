import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { Entry, Tag } from '../../types/gql-schema';
import { Block } from '../../types/portable-text';
import { Extend } from '../../util/common';
import { Link } from '@reach/router';
import { TagSelector } from '../Tag';
import { TagCategory, getCategory } from '../../util/tags';

export interface EntryEditProps {
  allTags: Tag[],
  entries: Entry[],
  entryId: string,
  onDone: (entry: Extend<Entry, { content: Block[] }>) => void
};

const EntryEdit: React.SFC<EntryEditProps> = ({
  allTags,
  entries,
  entryId,
  onDone
}) => {
  const [entry, setEntry] = useState<Extend<Entry, { content: Block[] }>>();
  const [entryTags, setEntryTags] = useState<Tag[]>([]);

  useEffect(() => {
    const entry = parseEntry(
      entries,
      entryId
    );

    if(entry) {
      setEntry(
        entry
      );

      setEntryTags(
        entry.tags
          .map(tagId => allTags.find(tag => tag.id === tagId))
          .filter((tag): tag is Tag => !!tag)
          .sort((a, b) => a.value.localeCompare(b.value))
      );
    }
  }, [entryId, entries]);

  if(!entry) {
    return null;
  }

  const categoryNames = ['Location', 'Project'];
  const categories = allTags
    .filter(tag => categoryNames.indexOf(tag.value) > -1)
    .map(tag => getCategory(allTags, tag.id));

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
      <div className="c_entry-edit__tag-list">
        {entryTags.map(tag =>
          <span key={tag.id} className="c_entry-edit__tag">{tag.value}</span>
        )}
      </div>
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
                onChange={value =>
                  setEntryTags(
                    updateTags(entryTags, value, { parent, tags })
                  )}
                selected={getSelectedCategory(entryTags, { parent, tags }).id}
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
              onDone({
                ...entry,
                tags: entryTags.map(tag => tag.id)
              });
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
  entryTags: Tag[],
  { tags }: TagCategory
): Tag {
  return entryTags.filter(tag => Object.keys(tags).indexOf(tag.id) > -1)[0];
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
  entryTags: Tag[],
  id: string,
  category: TagCategory
): Tag[] {
  const selectedTag = getSelectedCategory(
    entryTags,
    category
  );

  const i = entryTags.indexOf(selectedTag);
  const tag = category.tags[id];

  const result = [
    ...entryTags.slice(0, i),
    ...entryTags.slice(i + 1),
    ...(tag ? [tag] : [])
  ];

  result.sort((a, b) => a.value.localeCompare(b.value));

  return result;
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