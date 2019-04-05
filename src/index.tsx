import React from 'react';
import ReactDOM from 'react-dom';
import ApolloProvider from './ApolloProvider';

import 'typeface-open-sans';
import './index.scss';
import App from './components/App/App';

ReactDOM.render(
  <ApolloProvider>
    <App/>
  </ApolloProvider>,
  document.getElementById('app')
);