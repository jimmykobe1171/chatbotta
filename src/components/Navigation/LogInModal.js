import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import s from './LogInModal.css';
import ForgotPassword from './ForgotPassword';
import history from '../../core/history';

const customContentStyle = {
  width: '380px',
  maxWidth: 'none',
};

const CheckRemember = () => (
  <Checkbox
    label="Remember me"
  />
);

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class LogInModal extends React.Component {
  state = {
    open: false,
    email: '',
    password: '',
    data: [],
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  handleLoginSubmit = () => {
    fetch('/api/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      const error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    })
      .then((resp) => {
        console.log('LOGIN SUCCESS', resp);
        history.push({
          pathname: '/dashboard',
          state: {
            username: resp.username,
            courses: resp.courses,
          },
        });
      })
      .catch(e => e);
  }

  render() {
    const dialogActions = [
      <FlatButton onClick={this.handleLoginSubmit} label="Sign In" />,
    ];

    return (
      <div>
        <RaisedButton
          label="Log in"
          onClick={this.handleOpen}
          labelColor="#afafaf"
        />
        <Dialog
          title="Chatbot TA"
          actions={dialogActions}
          className={s.logInPage}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            fullWidth
          />
          <TextField
            hintText="password"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            fullWidth
          />
          <CheckRemember />
          <ForgotPassword />
        </Dialog>
      </div>
    );
  }
}
