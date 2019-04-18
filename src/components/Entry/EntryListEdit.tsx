import React, { useState } from 'react';
import { Entry } from '../../types/gql-schema';
import { Link } from '@reach/router';
import { Dict } from '../../util/common';

export interface EntryListEditProps {
  entries: Entry[],
  onDelete: (ids: string[]) => void,
};

const EntryListEdit: React.SFC<EntryListEditProps> = ({
  entries,
  onDelete,
}) => {
  const [toDelete, setToDelete] = useState<Dict<boolean>>({});

  return (
    <div className="c_entry-list-edit">
      <header className="c_entry-list-edit__header">
        <span>Entries</span>
        <Link to={`/`}>Cancel</Link>
      </header>
      <ul>
        {
          entries.map(entry => (
            <li key={entry.id}>
              <label>
                <input
                  checked={toDelete[entry.id] || false}
                  onChange={() => {
                    setToDelete({
                      ...toDelete,
                      [entry.id]: !toDelete[entry.id]
                    });
                  }}
                  name={entry.id}
                  type="checkbox"
                  />
                {entry.title}
              </label>
            </li>
          ))
        }
      </ul>
      <div className="c_entry-list-edit__actions">
        <button
          className="c_entry-list-edit__action"
          onClick={() => onDelete(
            Object.keys(toDelete).filter(key => toDelete[key])
          )}
        >Delete</button>
      </div>
    </div>
  );
};

export default EntryListEdit;