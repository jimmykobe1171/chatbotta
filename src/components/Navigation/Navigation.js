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

class LogIn extends React.Component{
  constructor(props) {
    super(props);
    this.popUp = this.popUp.bind(this);
    this.state = {logInPopUp: false};
  }

  popUp(){
    this.setState({logInPopUp: true});
  }

  renderNormal(){
    return (
      <RaisedButton label="Log in" onClick={this.popUp} />
    )
  }
  renderPopUp(){
    return(
        <RaisedButton label="Log in" disabled={true} />
    )
  }
  render() {
    return (this.state.logInPopUp) ? this.renderPopUp()
                                : this.renderNormal()
    }
}


class Navigation extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <span className={s.spacer}> | </span>
        <LogIn />
        <span className={s.spacer}>or</span>
        <RaisedButton 
        label="Sign up"
        primary={true}
        />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(s)(Navigation);
