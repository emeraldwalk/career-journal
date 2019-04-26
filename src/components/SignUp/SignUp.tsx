import React from 'react';
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import { config } from '../../../config/aws';

export interface SignUpProps {
};

const SignUp: React.SFC<SignUpProps> = ({}) => {
  const email = '';
  const password = '';

  const userPool = new CognitoUserPool({
    ClientId: config.cognitoClientId,
    UserPoolId: config.cognitoUserPoolId
  });
  const attributes: CognitoUserAttribute[] = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  ];

  userPool.signUp(
    email,
    password,
    attributes,
    [],
    (err, result) => {
      if(err) {
        alert(err.message || JSON.stringify(err));
        return;
      }

      console.log(`User: ${result!.user.getUsername()}`);
    }
  );

  return (
    <div>

    </div>
  );
};

export default SignUp;