import React from 'react';
import { Link } from '@reach/router';
import { Entry, Tag } from '../../types/gql-schema';
import { dayStr, Dict } from '../../util/common';
import { EntryTagList } from '.';

export interface EntryListProps {
  allTags: Dict<Tag>,
  entries: Entry[],
  onAdd: () => void
};

const EntryList: React.SFC<EntryListProps> = ({
  allTags,
  entries,
  onAdd
}) => {
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="c_entry-list">
      <header className="c_entry-list__header">
        <span>Entries</span>
        <Link to={`/edit`}>Edit</Link>
      </header>
      <ul className="c_entry-list__entries">
        {entries.map(entry => (
          <li
            key={entry.id}
            className="c_entry-list__entry">
            {dayStr(entry.date)}
            <Link to={`/entry/${entry.id}`}>
              {entry.title}
            </Link>
            <EntryTagList
              entryTags={entry.tags.map(id => allTags[id])}
            />
          </li>
        ))}
        <li><button className="c_entry-list__action" onClick={onAdd}>+</button></li>
      </ul>
    </div>
  );
};

export default EntryList;