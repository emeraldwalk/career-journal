import React from 'react';
import { EntryEdit, EntryList, EntryListEdit } from '.';
import { useCreateEntry } from '../../queries/create-entry';
import { useDeleteEntry } from '../../queries/delete-entry';
import { useUpdateEntry } from '../../queries/update-entry';
import { Route, Router } from '..';
import { newEntry } from '../../util/entry';
import { useListAll } from '../../queries/list-all';
import { toDict } from '../../util/common';

const CATEGORY_IDS = [
  '3680664b-2f99-45e1-aa9d-efbf0e94ee03', // Location
  'f933ada5-bc83-40e3-95d6-3ae8c07dc42a', // Project
]

export interface EntryListContainerProps {
  navigate: (path: string) => void
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({
  navigate
}) => {
  const { data, error, refetch } = useListAll({
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

  const allTags = toDict(data.listTags.items, 'id');
  const entries = data.listEntries.items;

  return (
    <div className="c_entry-list-container">
      <Router>
        <Route
          allTags={allTags}
          categoryTagIds={CATEGORY_IDS}
          component={EntryEdit}
          entries={entries}
          onDone={updateEntry}
          path="/entry/:entryId"
          />
        <Route
          allTags={allTags}
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