import React from 'react';
import { useCreateEntry } from '../../queries/entry-create';
import { useListEntries } from '../../queries/entry-list';
import { SpanType } from '../../gql-schema';

export interface EntryListContainerProps {
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({}) => {
  const { data, error } = useListEntries({
    fetchPolicy: 'cache-and-network'
  });

  const createEntry = useCreateEntry();

  if(!data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  return (
    <div className="c_entry-list-container">
      Entries
      <button onClick={() => {
        createEntry({
          blocks: [],
          date: new Date().toISOString().substr(0, 10),
          tags: [],
          title: '[New Entry]'
        })
        .then(console.log);
      }}>+</button>
    </div>
  )
};

export default EntryListContainer;