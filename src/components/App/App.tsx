import React from 'react';
import { Link, Router } from '@reach/router';
import { TagListContainer } from '..';

export interface AppProps {
};

const App: React.SFC<AppProps> = ({}) => (
  <div>
    <h1>Journal</h1>
    <Link to="/">Journal</Link>
    <Link to="/tags/__ROOT__">Tags</Link>
    <Router>
      <TagListContainer path="/tags/:categoryId/*"/>
    </Router>
  </div>
);

export default App;