import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
// import RaisedButton from 'material-ui/RaisedButton';
// import s from './Navigation.css';

const customContentStyle = {
  width: '380px',
  maxWidth: 'none',
};

const dataSource1 = [
  {
    text: 'Columbia College Chicago',
    value: (
      <MenuItem
        primaryText="Columbia College Chicago"
      />
    ),
  },
  {
    text: 'Columbia University in the City of New York',
    value: (
      <MenuItem
        primaryText="Columbia University in the City of New York"
      />
    ),
  },
];

const AutoCompleteExampleDataSource = () => (
  <div>
    <AutoComplete
      hintText="e.g. My University"
      filter={AutoComplete.caseInsensitiveFilter}
      dataSource={dataSource1}
      fullWidth
    />
  </div>
);


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
          contentStyle={customContentStyle}
          open={this.state.open}
        >
          <div>
            <h3>Select your school</h3>
            <p>Search for your school below.</p>
            <AutoCompleteExampleDataSource />
          </div>
        </Dialog>
      </div>
    );
  }
}
