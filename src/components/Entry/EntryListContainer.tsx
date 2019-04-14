import React from 'react';
import { useListEntries } from '../../queries/entry-list';

export interface EntryListContainerProps {
};

const EntryListContainer: React.SFC<EntryListContainerProps> = ({}) => {
  const { data, error } = useListEntries({
    fetchPolicy: 'cache-and-network'
  });

  if(!data) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error</div>
  }

  return (
    <div className="c_entry-list-container">
      Entries
    </div>
  )
};

export default EntryListContainer;