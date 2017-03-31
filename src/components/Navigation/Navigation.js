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

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.state = {logInPopUp: false, 
      signUpPopUp: false};
  }

  logIn(){
    this.setState({logInPopUp: true});
  }

  signUp(){
    this.setState({signUpPopUp: true});
  }

  logInButtonNormal(){
    return (
      <RaisedButton label="Log in" onClick={this.logIn} 
      labelColor="#AFAFAF"/>
    )
  }

  logInButtonDisabled(){
    return(
        <RaisedButton label="Log in" disabled={true} />
    )
  }

  signUpButtonNormal(){
    return (
      <RaisedButton label="Sign up" onClick={this.signUp}
        primary={true}/>
    )
  }

  signUpButtonDisabled(){
    return (
      <RaisedButton label="Sign up"
        primary={true} disabled={true}/>
    )
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <span className={s.spacer}> | </span>
        {(this.state.logInPopUp) ? this.logInButtonDisabled()
                                : this.logInButtonNormal()}            
        <span className={s.spacer}>or</span>
        {(this.state.signUpPopUp) ? this.signUpButtonDisabled()
                                : this.signUpButtonNormal()}        

        {(this.state.logInPopUp) ? 
           <div className={s.logInPage}>
           <h1>log in</h1>
           </div> : null }   
        {(this.state.signUpPopUp) ? 
           <div className={s.signUpPage}>
           <h1>sign up</h1>
           </div> : null }
      </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(s)(Navigation);
