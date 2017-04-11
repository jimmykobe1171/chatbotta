import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import s from './LogInModal.css';

const customContentStyle = {
  width: '380px',
  maxWidth: 'none',
};

const LogInTextField = () => (
  <div>
    <TextField
      hintText="email"
      fullWidth
    /><br />
    <TextField
      hintText="password"
      fullWidth
    /><br />
  </div>
);

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
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        disabled
        onClick={this.handleClose}
      />,
    ];

    return (
      <div className={s.button}>
        <RaisedButton
          label="Log in"
          onClick={this.handleOpen}
          labelColor="#AFAFAF"
        />
        <Dialog
          title="chatbot TA"
          className={s.logInPage}
          actions={actions}
          modal
          contentStyle={customContentStyle}
          open={this.state.open}
        >
          <LogInTextField />
          <CheckRemember />
        </Dialog>
      </div>
    );
  }
}
