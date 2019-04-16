import React from 'react';
import { Router as ReachRouter, RouterProps as ReachRouterProps } from '@reach/router';

export type RouterProps = ReachRouterProps & React.HTMLProps<HTMLDivElement>;

const Router: React.SFC<RouterProps> = ({
  children
}) => (
  <ReachRouter
    className="router"
  >{children}</ReachRouter>
);

export default Router;