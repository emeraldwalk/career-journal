import React from 'react';
import ReactDOM from 'react-dom';
import WithApolloProvider from './WithApolloProvider';

import 'typeface-open-sans';
import './index.scss';
import { App } from './components/App';

ReactDOM.render(
  <WithApolloProvider>
    <App/>
  </WithApolloProvider>,
  document.getElementById('app')
);