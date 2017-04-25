import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import RadioButton from 'material-ui/RadioButton';
import s from './SignUpModal.css';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class SignUpModal extends React.Component {
  constructor(props) {
    super(props);
    // this.onUpdateInput = this.onUpdateInput.bind(this);
    this.state = {
      open: false,
      student: true,
      ta: false,
      faculty: false,
      dataSource: [{ text: 'Columbia University',
        value: (
          <MenuItem
            primaryText={'Columbia University'}
          />
              ),
      },
      { text: 'NYU',
        value: (
          <MenuItem
            primaryText={'NYU'}
          />
              ),
      },
      ],
      courseSource: [{ text: 'Advanced Software Engineering',
        value: (
          <MenuItem
            primaryText={'Advanced Software Engineering'}
          />
              ),
      },
      { text: 'Machine Learning',
        value: (
          <MenuItem
            primaryText={'Machine Learnings'}
          />
              ),
      },
      { text: 'Natural Language Processing',
        value: (
          <MenuItem
            primaryText={'Natural Language Processing'}
          />
              ),
      },
      ],
    };
  }

  // onUpdateInput(inputValue) {
    // const self = this;
    // self.performSearch(inputValue);
  // }

  // performSearch(inputValue) {
  //   if (inputValue !== '') {
  //     fetch('/api/schools', {
  //       method: 'get',
  //     }).then((resp) => {
  //       if (resp.status >= 200 && resp.status < 400) {
  //         return resp.json();
  //       }
  //       const error = new Error(resp.statusText);
  //       error.response = resp;
  //       throw error;
  //     })
  //       .then((resp) => {
  //         const schools = [];
  //         for (school of resp) {
  //           schools.push({
  //             text: school.name,
  //             value: (
  //               <MenuItem
  //                 primaryText={school.name}
  //               />
  //             ),
  //           });
  //         }
  //         console.log('YES', schools);
  //         self.setState({
  //           dataSource: schools,
  //         });
  //       })
  //       .catch(e => e);
  //   }
  // }


  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

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

    const customContentStyle = {
      width: '380px',
      maxWidth: 'none',
    };

    const AutoCompleteSchoolDataSource = () => (
      <div>
        <AutoComplete
          hintText="e.g. My University"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.state.dataSource}
          onUpdateInput={this.onUpdateInput}
          fullWidth
        />
      </div>
    );

    const AutoCompleteCourseDataSource = () => (
      <div>
        <AutoComplete
          hintText="e.g. My Course"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.state.courseSource}
          fullWidth
        />
      </div>
    );

    return (
      <div>
        <RaisedButton label="Sign up" onClick={this.handleOpen} primary />
        <Dialog
          className={s.signUpPage}
          title="Chatbot TA"
          actions={actions}
          modal
          contentStyle={customContentStyle}
          open={this.state.open}
        >
          <div>
            <h3>Select your school</h3>
            <p>Search for your school below.</p>
            <AutoCompleteSchoolDataSource />
          </div>
          <div>
            <h3>Select your course</h3>
            <p>Search for your course below.</p>
            <AutoCompleteCourseDataSource />
          </div>
          <RadioButton label="Student" value={this.state.student} />
          <RadioButton label="TA" value={this.state.ta} />
          <RadioButton label="Faculty" value={this.state.faculty} />
        </Dialog>
      </div>
    );
  }
}
