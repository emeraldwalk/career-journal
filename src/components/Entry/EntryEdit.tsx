import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { Entry, Tag } from '../../types/gql-schema';
import { Block } from '../../types/portable-text';
import { Dict, Extend, findInDict } from '../../util/common';
import { Link } from '@reach/router';
import { TagSelector } from '../Tag';
import { TagCategory, getCategory } from '../../util/tags';

export interface EntryEditProps {
  allTags: Dict<Tag>,
  categoryTagIds: string[],
  entries: Entry[],
  entryId: string,
  onDone: (entry: Extend<Entry, { categoryTags: Dict<string>, content: Block[] }>) => void
};

const EntryEdit: React.SFC<EntryEditProps> = ({
  allTags,
  categoryTagIds,
  entries,
  entryId,
  onDone
}) => {
  const [entry, setEntry] = useState<Extend<Entry, { content: Block[] }>>();
  const [entryCategories, setEntryCategories] = useState<Dict<Tag>>({});
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

      setEntryCategories(
        Object.keys(entry.categoryTags).reduce((memo, categoryKey) => {
          const tagKey = entry.categoryTags[categoryKey];
          return {
            ...memo,
            [categoryKey]: allTags[tagKey]
          };
        }, {})
      );

      setEntryTags(
        entry.tags
          .map(tagId => allTags[tagId])
          .filter((tag): tag is Tag => !!tag)
          .sort((a, b) => a.value.localeCompare(b.value))
      );
    }
  }, [entryId, entries]);

  if(!entry) {
    return null;
  }

  // const categoryNames = ['Location', 'Project'];
  // const categories = allTags
  //   .filter(tag => categoryNames.indexOf(tag.value) > -1)
  //   .map(tag => getCategory(allTags, tag.id));

  const categoryTags = categoryTagIds.map(id => allTags[id]);

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
            categoryTags.map(category => (
              <span key={category.id}>{category.value}</span>
            ))
          }
        </div>
        <div className="c_entry-edit__tag-selector-inputs">
          {
            categoryTags.map(category => (
              <TagSelector
                key={category.id}
                onChange={value => {
                  const addTag = allTags[value];

                  setEntryTags(
                    updateTags(
                      entryTags,
                      addTag,
                      entryCategories[category.id],
                    )
                  );

                  setEntryCategories({
                    ...entryCategories,
                    [category.id]: addTag
                  })
                }}
                selected={(entryCategories[category.id] || {}).id}
                tags={findInDict(allTags, tag => tag.parentId === category.id)}
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
                categoryTags: Object.keys(entryCategories).reduce((memo, categoryKey) => {
                  return {
                    ...memo,
                    [categoryKey]: entryCategories[categoryKey].id
                  }
                }, {}),
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

function parseEntry(
  entries: Entry[],
  entryId: string
) {
  const entry = entries.find(entry => entry.id === entryId);
  if(entry) {
    return {
      ...entry,
      categoryTags: JSON.parse(entry.categoryTags) as Dict<string>,
      content: JSON.parse(entry.content) as Block[]
    };
  }
}

function updateTags(
  entryTags: Tag[],
  add?: Tag,
  remove?: Tag,
): Tag[] {
  entryTags = entryTags.slice(0);

  if(remove) {
    const i = entryTags.findIndex(tag => tag.id === remove.id);
    if(i > -1) {
      entryTags = [
        ...entryTags.slice(0, i),
        ...entryTags.slice(i + 1),
      ];
    }
  }

  if(add) {
    const i = entryTags.findIndex(tag => tag.id === add.id);
    if(i < 0) {
      entryTags = [
        ...entryTags,
        add
      ];
    }
  }

  entryTags.sort((a, b) => a.value.localeCompare(b.value));

  return entryTags;
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