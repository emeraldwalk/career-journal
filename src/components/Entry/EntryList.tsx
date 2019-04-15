import React from 'react';
import { Link } from '@reach/router';
import { Entry } from '../../types/gql-schema';

export interface EntryListProps {
  entries: Entry[],
  onAdd: () => void
};

const EntryList: React.SFC<EntryListProps> = ({
  entries,
  onAdd
}) => (
  <ul>
    {entries.map(entry => (
      <li key={entry.id}>
        <Link to={`/entry/${entry.id}`}>
          {entry.title}
        </Link>
      </li>
    ))}
    <li><button onClick={onAdd}>+</button></li>
  </ul>
);

export default EntryList;