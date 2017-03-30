/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue300} from 'material-ui/styles/colors';


const muiTheme = getMuiTheme({
  borderRadius: 5,
  palette: {
    primary1Color: blue300,
  },
}, { userAgent: 'all' });

const LogIn = () => (
  <RaisedButton label="Log in" />
);

const SignUp = () => (
  <RaisedButton 
  label="Sign up"
  primary={true}
  />
);

class Navigation extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <span className={s.spacer}> | </span>
        <LogIn />
        {
        // <Link className={cx(s.link, s.lowlight)} to="/login">Log in</Link>
        }
        <span className={s.spacer}>or</span>
        <SignUp />
        {
        // <Link className={cx(s.link, s.highlight, s.link.highlight)} to="/register">Sign up</Link>
        }
      </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(s)(Navigation);
