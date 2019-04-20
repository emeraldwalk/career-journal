import React from 'react';
import { Link } from '@reach/router';
import { Entry } from '../../types/gql-schema';
import { dayStr } from '../../util/common';

export interface EntryListProps {
  entries: Entry[],
  onAdd: () => void
};

const EntryList: React.SFC<EntryListProps> = ({
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
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            {dayStr(entry.date)}
            <Link to={`/entry/${entry.id}`}>
              {entry.title}
            </Link>
          </li>
        ))}
        <li><button className="c_entry-list__action" onClick={onAdd}>+</button></li>
      </ul>
    </div>
  );
};

export default EntryList;