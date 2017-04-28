import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import AutoCompleteSchool from './AutoCompleteSchool';
import AutoCompleteCourse from './AutoCompleteCourse';
import s from './SignUpModal.css';

const SignUpModes = {
  SCHOOL: 1,
  COURSES: 2,
  ROLE: 3,
  SUMMARY: 4,
};

class SignUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: SignUpModes.SCHOOL,
      open: false,
      school: null,
      courses: null,
      role: null,
      data: [],
      email: '',
      errorInvalidCred: false,
      formValid: false,
      password: '',
    };
  }

  onSelectSchool = (school) => {
    this.setState({
      mode: SignUpModes.COURSES,
      school,
    });
  }

  onSelectCourse = (courses) => {
    this.setState({
      mode: SignUpModes.COURSES,
      courses,
    });
  }

  onSelectRole = () => {
    this.setState({
      mode: SignUpModes.ROLE,
    });
  }

  onSummary = () => {
    this.setState({
      mode: SignUpModes.SUMMARY,
    });
  }

  handleRoleSelection = (e) => {
    this.setState({
      role: e.target.value,
    });
  }

  goEditSchool = () => {
    this.setState({
      mode: SignUpModes.SCHOOL,
    });
  }

  goEditCourses = () => {
    this.setState({
      mode: SignUpModes.COURSES,
    });
  }

  validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

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

  handleSignUpSubmit = () => {
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
        console.log('SignUpModal - handleSignUpSubmit -  SUCCESS', resp);
        history.push({
          pathname: '/dashboard',
          state: {
            courses: resp.courses,
            username: resp.username,
          },
        });
      })
      .catch((e) => {
        console.log('SignUpModal - handleSignUpSubmit - FAIL', e);
        this.setState({ errorInvalidCred: true });
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
            onClick={this.onSelectCourse}
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
          onClick={this.onSelectRole}
          primary
        /> :
          null,
      this.state.mode === SignUpModes.ROLE ?
        <RaisedButton
          className={s.actionButton}
          label="Join Courses"
          onClick={this.onSummary}
          primary
        /> :
          null,
      this.state.mode === SignUpModes.SUMMARY ?
        <RaisedButton
          className={s.actionButton}
          label="submit"
          onClick={this.handleClose}
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
                <AutoCompleteCourse onSelectCourse={this.onSelectCourse} />
              </div>) :
              null}
          {
            // End of select courses
          }

          {
            // Select role  TODO: role status
          }
          {this.state.mode === SignUpModes.ROLE ?
              (<div>
                <p>{this.state.courses.name}</p>
                <RaisedButton
                  className={s.editSchoolButton}
                  label="Edit School"
                  labelColor="#afafaf"
                  onClick={this.goEditSchool}
                />
                <span>Join as:</span>
                <div>
                  <RadioButtonGroup name="selectRole">
                    <RadioButton
                      label="student"
                      value={'student'}
                      className={s.radioButton}
                      onChange={this.handleRoleSelection}
                    />
                    <RadioButton
                      label="TA"
                      value="TA"
                      className={s.radioButton}
                      onChange={this.handleRoleSelection}
                    />
                    <RadioButton
                      label="professor"
                      value="professor"
                      className={s.radioButton}
                      onChange={this.handleRoleSelection}
                    />
                  </RadioButtonGroup>
                </div>
              </div>) :
              null}

          {
            // End of select role
          }

          {
            // Summary
          }

          {this.state.mode === SignUpModes.SUMMARY ?
            (<div>
              <RaisedButton
                className={s.editSchoolButton}
                label="Edit Courses"
                labelColor="#afafaf"
                onClick={this.goEditCourse}
              />
              <p>{this.state.school.name}</p>
              <p>{this.state.courses.name}</p>
              <p>Join as [ ]{this.state.role}</p>
              <p>Enter your school email and password to register</p>
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
            </div>) : null
          }
        </Dialog>
      </div>
    );
  }
}

export default withStyles(s)(SignUpModal);
