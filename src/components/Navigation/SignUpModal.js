import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoCompleteSchool from './AutoCompleteSchool';
import s from './SignUpModal.css';

const SignUpModes = {
  SCHOOL: 1,
  COURSES: 2,
  SUMMARY: 3,
};

class SignUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: SignUpModes.SCHOOL,
      open: false,
      school: null,
    };
  }

  onSelectSchool = (school) => {
    this.setState({
      mode: SignUpModes.COURSES,
      school,
    });
  }

  goEditSchool = () => {
    this.setState({
      mode: SignUpModes.SCHOOL,
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    /* TODO:
     * 1. Add onClick actions to the RaisedButtons;
     * 2. Think of a better and less nasty way to write the following logic to
     *    avoid the linter's nested-ternary check;
     */
    const firstButtonLogic =
        this.state.mode === SignUpModes.COURSES ?
          (<RaisedButton
            className={s.leftButton}
            label="Add Course"
            labelColor="#afafaf"
          />) : null;

    const actions = [
      this.state.mode === SignUpModes.SCHOOL ?
        <FlatButton
          label="Next, you will add your classes"
          primary
          disabled
        /> : firstButtonLogic,
      this.state.mode === SignUpModes.COURSES ?
        <RaisedButton
          className={s.actionButton}
          label="Join Courses"
          primary
        /> :
          null,
    ];

    const customContentStyle = {
      width: '380px',
      maxWidth: 'none',
    };

    return (
      <div>
        <RaisedButton label="Sign up" onClick={this.handleOpen} primary />
        <Dialog
          className={s.signUpPage}
          actions={actions}
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
              <span>Sign up to start WINNING with our bots</span>
            </div>
          </div>

          {
            // Select school
          }
          {this.state.mode === SignUpModes.SCHOOL ?
              (<div>
                <h3 className={s.promptTitle}>Select your school</h3>
                <span>Search for your courses below.</span>
                {
                  /* TODO: Replace the AutoCompleteSchool component below with
                   * a similar implementation of an AutoCompleteCourse component
                   */
                }
                <AutoCompleteSchool onSelectSchool={this.onSelectSchool} />
              </div>) :
              null}
          {
            // End of select school
          }

          {
            // Select courses
          }
          {this.state.mode === SignUpModes.COURSES ?
              (<div>
                <h3 className={s.promptTitle}>
                  Select your classes<br />at {this.state.school.name}
                </h3>
                <span>Search for your courses below.</span>
                <RaisedButton
                  className={s.editSchoolButton}
                  label="Edit School"
                  labelColor="#afafaf"
                  onClick={this.goEditSchool}
                />
                <AutoCompleteSchool onSelectSchool={this.onSelectSchool} />
              </div>) :
              null}
          {
            // End of select courses
          }

        </Dialog>
      </div>
    );
  }
}

export default withStyles(s)(SignUpModal);
