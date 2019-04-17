import React from 'react';
import { EntryEdit, EntryList } from '.';
import { useCreateEntry } from '../../queries/create-entry';
import { useListEntries } from '../../queries/list-entry';
import { useUpdateEntry } from '../../queries/update-entry';
import { Route, Router } from '..';

export interface EntryListContainerProps {
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({}) => {
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

  return (
    <div className="c_entry-list-container">
      <Router>
        <Route
          component={EntryEdit}
          entries={data.listEntries.items}
          onDone={updateEntry}
          path="/entry/:entryId"
          />
        <Route
          component={EntryList}
          entries={data.listEntries.items}
          onAdd={ () =>
            createEntry({
              content: [
                {
                  _type: 'block',
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      text: 'This is an entry.',
                      marks: []
                    }
                  ]
                }
              ],
              date: new Date().toISOString().substr(0, 10),
              tags: [],
              title: '[New Entry]'
            })
            .then(console.log)
          }
          path="/"
          />
      </Router>
    </div>
  )
};

export default EntryListContainer;