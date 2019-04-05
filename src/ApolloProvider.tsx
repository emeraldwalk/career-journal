import React from 'react';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import { client } from './config/awsConfig';

export interface WithProviderProps {
  children: React.ReactNode
}

const WithProvider: React.SFC<WithProviderProps> = ({
  children
}) => (
  <ApolloProvider client={client}>
    <Rehydrated>
      {children}
    </Rehydrated>
  </ApolloProvider>
);

export default WithProvider;