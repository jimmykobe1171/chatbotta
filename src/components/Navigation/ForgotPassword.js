import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
// import RaisedButton from 'material-ui/RaisedButton';
// import s from './ForgotPassword.css';

const customContentStyle = {
  width: '380px',
  maxWidth: 'none',
};

const ResetPwTextField = () => (
  <div>
    <TextField
      hintText="email"
      fullWidth
    />
  </div>
);

export default class ForgotPassword extends React.Component {
  state = {
    open: false,
    reset: true,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleReset = () => {
    this.setState({ reset: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        label="reset password"
        primary
        onClick={this.handleReset}
      />,
    ];

    return (
      <div>
        <FlatButton
          label="forgot your password?"
          onClick={this.handleOpen}
          primary
        />
        <Dialog
          title="chatbot TA"
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <p>Enter the email address you used to register for Chatbot TA.</p>
          {(this.state.reset) ?
            <ResetPwTextField />
          : <div><p>Thanks! We just sent you an email with a link to set a
          new password. Click on the link in the email to continue.</p></div>}
        </Dialog>
      </div>
    );
  }
}
