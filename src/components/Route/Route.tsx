import React from 'react';
import { RouteComponentProps } from '@reach/router';

/**
 * Props consist of a component, it's props,
 * and optional Reach router props.
 */
export type RouteProps<T> = {
  component: React.ComponentType<T>
} & RouteComponentProps & T;

/**
 * Wrapper component for @reach/router routes.
 * Makes it so we don't have to account for
 * RouteComponentProps in our regular components,
 * but we have them if we need them.
 */
function Route<T>({
  component: Component,
  ...rest
}: RouteProps<T>) {
  return <Component {...rest as T & RouteComponentProps}/>
}

export default Route;