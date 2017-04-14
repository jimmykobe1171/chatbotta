import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import s from './LogInModal.css';
import ForgotPassword from './ForgotPassword';

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
      redirect: '/dashboard',
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        console.log('LOGIN SUCCESS', response);
        window.location.href = './dashboard';
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
      .then(response => response.json())
      .catch(e => e);
  }

  render() {
    return (
      <div>
        <RaisedButton
          label="Log in"
          onClick={this.handleOpen}
          labelColor="#AFAFAF"
        />
        <Dialog
          title="Chatbot TA"
          className={s.logInPage}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <form onSubmit={this.handleLoginSubmit}>
            <TextField
              hintText="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              fullWidth
            /><br />
            <TextField
              hintText="password"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              fullWidth
            /><br />
            <CheckRemember />
            <ForgotPassword />
            <button type="submit">Sign In</button>
          </form>
        </Dialog>
      </div>
    );
  }
}
