import React from 'react';
import { CategoryListConnected as CategoryList } from '..';

export interface AppProps {
};

const App: React.SFC<AppProps> = ({}) => (
  <div>
    <h1>Journal</h1>
    <CategoryList/>
  </div>
);

export default App;