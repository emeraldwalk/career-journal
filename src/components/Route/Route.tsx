import React from 'react';
import { RouteComponentProps, Match } from '@reach/router';
import { Omit } from '../../util/common';

/**
 * Reach router matching props.
 */
interface MatchingProps {
  default?: string,
  path?: string
}

/**
 * Reach router props passed to components implicitly.
 */
type RoutePropsImplicit = Omit<
  RouteComponentProps,
  keyof MatchingProps
>;

/**
 * Route props consist of a component to render,
 * its props (minus implicit props), and
 * matching props.
 */
type RouteProps<T> =
  { component: React.ComponentType<T> } &
  MatchingProps &
  Partial<T>;
  //Omit<T & RoutePropsImplicit, keyof RoutePropsImplicit>;

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
  return <Component {...rest as unknown as T}/>
}

export default Route;