import React from 'react';
import { Link } from '@reach/router';

export interface NavProps {
};

const Nav: React.SFC<NavProps> = ({}) => (
  <nav className="c_nav">
    <Link to="/">Journal</Link>
    <Link to="/tag/__ROOT__">Tags</Link>
    <Link to="/signin">Sign In</Link>
  </nav>
);

export default Nav;