import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import s from './Navigation.css';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class SignUpModal extends React.Component {
  state = {
    open: true,
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
      <div>
        <Dialog
          title="chatbot TA"
          actions={actions}
          modal
          open={this.state.open}
        >
          sign up.
        </Dialog>
      </div>
    );
  }
}
