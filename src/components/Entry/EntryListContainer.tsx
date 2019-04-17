import React from 'react';
import { EntryEdit, EntryList } from '.';
import { useCreateEntry } from '../../queries/create-entry';
import { useListEntries } from '../../queries/list-entry';
import { useUpdateEntry } from '../../queries/update-entry';
import { Route, Router } from '..';

export interface EntryListContainerProps {
  navigate: (path: string) => void
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({
  navigate
}) => {
  const { data, error } = useListEntries({
    fetchPolicy: 'cache-and-network'
  });

  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();

  if(!data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const entries = data.listEntries.items;

  return (
    <div className="c_entry-list-container">
      <Router>
        <Route
          component={EntryEdit}
          entries={entries}
          onDone={updateEntry}
          path="/entry/:entryId"
          />
        <Route
          component={EntryList}
          entries={entries}
          onAdd={ () =>
            createEntry({
              content: [
                {
                  _type: 'block',
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      text: null,
                      marks: []
                    }
                  ]
                }
              ],
              date: new Date().toISOString().substr(0, 10),
              tags: [],
              title: '[New Entry]'
            })
            .then(entry => {
              entries.push(entry);
              navigate(`/entry/${entry.id}`);
            })
          }
          path="/"
          />
      </Router>
    </div>
  )
};

export default EntryListContainer;