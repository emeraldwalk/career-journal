import React, { useState } from 'react';
import { EntryEdit, EntryList, EntryListEdit } from '.';
import { useCreateEntry } from '../../queries/create-entry';
import { useDeleteEntry } from '../../queries/delete-entry';
import { useListEntries } from '../../queries/list-entry';
import { useUpdateEntry } from '../../queries/update-entry';
import { Route, Router } from '..';

export interface EntryListContainerProps {
  navigate: (path: string) => void
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({
  navigate
}) => {
  const { data, error, refetch } = useListEntries({
    fetchPolicy: 'cache-and-network'
  });

  const createEntry = useCreateEntry();
  const deleteEntry = useDeleteEntry();
  const updateEntry = useUpdateEntry();

  if(!data || !data.listEntries) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  const entries = data.listEntries.items;

  function onAdd() {
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
      refetch()
        .then(() => navigate(`/entry/${entry.id}`));
    });
  }

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
          onAdd={onAdd}
          path="/"
          />
        <Route
          component={EntryListEdit}
          entries={entries}
          onDelete={
            (entryIds: string[]) => {
              Promise.all(
                entryIds.map(deleteEntry)
              )
              .then(() => refetch())
              .then(() => navigate('/'));
            }
          }
          path="/edit"
          />
      </Router>
    </div>
  )
};

export default EntryListContainer;