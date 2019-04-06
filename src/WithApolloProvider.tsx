import React from 'react';
import { Rehydrated } from 'aws-appsync-react';
// TODO: get rid of ApollowProvider once I have no more references to it
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { client } from './awsClient';

export interface WithProviderProps {
  children: React.ReactNode
}

const WithApolloProvider: React.SFC<WithProviderProps> = ({
  children
}) => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Rehydrated>
        {children}
      </Rehydrated>
    </ApolloHooksProvider>
  </ApolloProvider>
);

export default WithApolloProvider;