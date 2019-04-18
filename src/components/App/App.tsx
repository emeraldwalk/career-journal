import React from 'react';
import { EntryListContainer, Nav, Route, Router, TagListContainer } from '..';

export interface AppProps {
};

const App: React.SFC<AppProps> = ({}) => (
  <div className="c_app">
    <h1>Journal</h1>
    <Nav/>
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