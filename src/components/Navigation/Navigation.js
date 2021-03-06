/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue300 } from 'material-ui/styles/colors';
import s from './Navigation.css';
import LogInModal from './LogInModal';
import SignUpModal from './SignUpModal';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  borderRadius: 5,
  palette: {
    primary1Color: blue300,
  },
}, { userAgent: 'all' });

class Navigation extends React.Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={s.root} role="navigation">
          <LogInModal className={s.signInButton} />
          <span className={s.spacer}>or</span>
          <SignUpModal className={s.signUpButton} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(s)(Navigation);
