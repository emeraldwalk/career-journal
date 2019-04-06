import React from 'react';
import { TagListEdit } from '..';

export interface AppProps {
};

const App: React.SFC<AppProps> = ({}) => (
  <div>
    <h1>Journal</h1>
    <TagListEdit/>
  </div>
);

export default App;