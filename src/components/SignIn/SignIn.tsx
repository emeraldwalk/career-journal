import React from 'react';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from 'amazon-cognito-identity-js';
import { config } from '../../../config/aws';

export interface SignInProps {
};

const SignIn: React.SFC<SignInProps> = ({}) => {
  const email = '';
  const password = '';

  const userPool = new CognitoUserPool({
    ClientId: config.cognitoClientId,
    UserPoolId: config.cognitoUserPoolId
  });

  const user = new CognitoUser({
    Pool: userPool,
    Username: email
  });

  const auth = new AuthenticationDetails({
    Username: email,
    Password: password
  });

  user.authenticateUser(auth, {
    onSuccess: result => {
    },
    onFailure: err => {
    }
  });

  return (
    <div>

    </div>
  );
};

export default SignIn;