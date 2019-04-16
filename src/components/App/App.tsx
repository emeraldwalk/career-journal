import React from 'react';
import { Link } from '@reach/router';
import { EntryListContainer, Route, Router, TagListContainer } from '..';

export interface AppProps {
};

const App: React.SFC<AppProps> = ({}) => (
  <div className="c_app">
    <h1>Journal</h1>
    <Link to="/">Journal</Link>
    <Link to="/tag/__ROOT__">Tags</Link>
    <Router>
      <Route
        component={EntryListContainer}
        path="/*"
        />
      <Route
        component={TagListContainer}
        path="/tag/:categoryId/*"
        />
    </Router>
  </div>
);

export default App;