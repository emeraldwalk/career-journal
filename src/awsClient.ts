import AWSAppSyncClient from 'aws-appsync';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

import { config } from '../config/aws';

const userPool = new CognitoUserPool({
  ClientId: config.cognitoClientId,
  UserPoolId: config.cognitoUserPoolId
});

export const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    apiKey: config.aws_appsync_apiKey,
    jwtToken: () => {
      return new Promise<string>((resolve, reject) => {

        const user = userPool.getCurrentUser();
        if(!user) {
          return resolve('');
        }

        user.getSession((err: unknown, session?: { accessToken?: { jwtToken?: string }}) => {
          if(err) {
            return reject(err);
          }

          if(session && session.accessToken && session.accessToken.jwtToken) {
            return resolve(session.accessToken.jwtToken);
          }

          return resolve('');
        });
      });
    }
  }
});