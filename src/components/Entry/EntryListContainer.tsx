import React from 'react';
import { EntryEdit, EntryList, EntryListEdit } from '.';
import { useCreateEntry } from '../../queries/create-entry';
import { useDeleteEntry } from '../../queries/delete-entry';
import { useUpdateEntry } from '../../queries/update-entry';
import { Route, Router } from '..';
import { newEntry } from '../../util/entry';
import { useListTags } from '../../queries/list-tags';
import { useListAll } from '../../queries/list-all';

export interface EntryListContainerProps {
  navigate: (path: string) => void
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({
  navigate
}) => {
  const { data, error, refetch } = useListAll({
    fetchPolicy: 'cache-and-network'
  });

  const { data: tagData } = useListTags({
    fetchPolicy: 'cache-and-network'
  });

  const createEntry = useCreateEntry();
  const deleteEntry = useDeleteEntry();
  const updateEntry = useUpdateEntry();

  if(!data || !data.listEntries || !data.listTags) {
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
          allTags={data.listTags.items}
          component={EntryEdit}
          entries={entries}
          onDone={updateEntry}
          path="/entry/:entryId"
          />
        <Route
          component={EntryList}
          entries={entries}
          onAdd={() => {
            createEntry(
              newEntry()
            )
            .then(entry => {
              refetch()
                .then(() => navigate(`/entry/${entry.id}`));
            });
          }}
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