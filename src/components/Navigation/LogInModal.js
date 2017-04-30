import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LogInModal.css';
import history from '../../core/history';

const customContentStyle = {
  width: '380px',
  maxWidth: 'none',
};

class LogInModal extends React.Component {
  state = {
    data: [],
    email: '',
    errorInvalidCred: false,
    formValid: false,
    open: false,
    password: '',
  };

  validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
      formValid: e.target.value !== '' &&
          this.validateEmail(e.target.value) &&
          this.state.password !== '',
    });
    this.setState({ errorInvalidCred: false });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
      formValid: e.target.value !== '' &&
          this.validateEmail(this.state.email) &&
          this.state.email !== '',
    });
    this.setState({ errorInvalidCred: false });
  }

  handleLoginSubmit = () => {
    fetch('/api/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      credentials: 'same-origin',
    }).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      const error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    })
      .then((resp) => {
        console.log('LogInModal - handleLoginSubmit - SUCCESS', resp);
        history.push({
          pathname: '/dashboard',
          state: {
            courses: resp.courses,
            username: resp.username,
          },
        });
      })
      .catch((e) => {
        console.log('LogInModal - handleLoginSubmit - FAIL', e);
        this.setState({ errorInvalidCred: true });
      });
  }

  render() {
    const dialogActions = [
      this.state.formValid ?
        <RaisedButton
          className={s.dialogActionButton}
          label="Sign In"
          onClick={this.handleLoginSubmit}
          primary
        /> :
          null,
    ];

    return (
      <div>
        <RaisedButton
          label="Sign In"
          onClick={this.handleOpen}
          labelColor="#afafaf"
        />
        <Dialog
          actions={dialogActions}
          className={s.logInPage}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className={s.banner}>
            <div className={s.bannerTitle}>
              <span>Chatbot TA</span>
            </div>
            <div className={s.bannerSubtitle}>
              <span>Sign in with our TREMENDOUS learning platform</span>
            </div>
          </div>
          <TextField
            hintText="Email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            fullWidth
          />
          <TextField
            hintText="Password"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            fullWidth
          />
          {this.state.errorInvalidCred ?
            <span className={s.error}>Invalid username or password.</span> :
              null}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(s)(LogInModal);
