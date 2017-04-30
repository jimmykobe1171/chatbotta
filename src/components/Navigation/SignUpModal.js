import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AutoCompleteSchool from './AutoCompleteSchool';
import AutoCompleteCourse from './AutoCompleteCourse';
import s from './SignUpModal.css';
import studentImg from '../../images/student.png';
import taImg from '../../images/ta.png';
import facultyImg from '../../images/faculty.png';
import history from '../../core/history';

const SignUpModes = {
  SCHOOL: 1,
  COURSES: 2,
  SUMMARY: 3,
};

class SignUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [
        {
          course: null,
          joinType: 'student',
          onSelectCourse: this.onSelectCourse,
          onSelectJoinType: this.onSelectJoinType,
          onRemoveCourse: this.onRemoveCourse,
        },
      ],
      email: '',
      errorNoCourses: false,
      formValid: false,
      mode: SignUpModes.SCHOOL,
      open: false,
      password: '',
      school: null,
    };
  }

  onSelectSchool = (school) => {
    this.setState({
      mode: SignUpModes.COURSES,
      school,
    });
  }

  onSelectCourse = (course, index) => {
    const courses = this.state.courses.slice();
    courses[index].course = course;
    this.setState({
      courses,
      errorNoCourses: false,
    });
  }

  onSelectJoinType = (joinType, index) => {
    const courses = this.state.courses.slice();
    courses[index].joinType = joinType;
    this.setState({ courses });
  }

  onRemoveCourse = (index) => {
    const courses = this.state.courses.slice();
    delete courses[index];
    this.setState({
      courses,
    });
  }

  validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  addCourse = () => {
    const courses = this.state.courses.slice();
    courses.push(
      {
        course: null,
        joinType: 'student',
        onSelectCourse: this.onSelectCourse,
        onSelectJoinType: this.onSelectJoinType,
        onRemoveCourse: this.onRemoveCourse,
      },
    );
    this.setState({
      courses,
      errorNoCourses: false,
    });
  }

  selectedCourses = () => this.state.courses.filter(course =>
      course !== undefined && course.course !== null,
  ).map((course) => {
    const selectedCourse = course.course;
    selectedCourse.joinType = course.joinType;
    return selectedCourse;
  })

  joinCourses = () => {
    if (this.selectedCourses().length === 0) {
      this.setState({
        errorNoCourses: true,
      });
      return;
    }
    this.setState({
      mode: SignUpModes.SUMMARY,
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

  signUp = () => {
    fetch('/api/register', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        school: this.state.school.id,
        courses: this.selectedCourses().map(course => ({
          id: course.id,
          joinType: course.joinType,
        })),
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
        console.log('SignUpModal - signUp - SUCCESS', resp);
        history.push('/dashboard');
      })
      .catch((e) => {
        console.log('SignUpModal - signUp - FAIL', e);
      });
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
      formValid: e.target.value !== '' &&
          this.validateEmail(e.target.value) &&
          this.state.password !== '',
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
      formValid: e.target.value !== '' &&
          this.validateEmail(this.state.email) &&
          this.state.email !== '',
    });
  }

  render() {
    /* TODO:
     * 1. Add onClick actions to the RaisedButtons;
     * 2. Think of a better and less nasty way to write the following logic to
     *    avoid the linter's nested-ternary check;
     */
    const actionFirstNestedTernary =
         this.state.mode === SignUpModes.SUMMARY ?
            (<RaisedButton
              className={s.leftButton}
              label={'Edit Courses'}
              labelColor={'#afafaf'}
              onClick={this.goEditCourses}
            />) : null;

    const actionSecondNestedTernary =
         this.state.mode === SignUpModes.COURSES ?
           (<RaisedButton
             className={s.leftButton}
             label={'Add Course'}
             labelColor={'#afafaf'}
             onClick={this.addCourse}
           />) : actionFirstNestedTernary;

    const actionThirdNestedTernary =
         this.state.mode === SignUpModes.SUMMARY ?
           (<RaisedButton
             className={s.actionButton}
             label={'Sign Up'}
             labelColor={'#afafaf'}
             style={{ visibility: 'hidden' }}
             primary
           />) :
            null;

    const actionFourthNestedTernary =
         this.state.mode === SignUpModes.SUMMARY && this.state.formValid ?
           (<RaisedButton
             className={s.actionButton}
             label={'Sign Up'}
             labelColor={'#afafaf'}
             onClick={this.signUp}
             primary
           />) : actionThirdNestedTernary;

    const actions = [
      this.state.mode === SignUpModes.SCHOOL ?
        <FlatButton
          label={'Next, you will add your classes'}
          primary
          disabled
        /> : actionSecondNestedTernary,
      this.state.mode === SignUpModes.COURSES ?
        <RaisedButton
          className={s.actionButton}
          label={'Join Courses'}
          onClick={this.joinCourses}
          primary
        /> :
         actionFourthNestedTernary,
    ];

    const customContentStyle = {
      width: '380px',
      maxWidth: 'none',
    };

    const courseList = this.state.courses.map((course, index) => (
      <AutoCompleteCourse
        index={index}
        onSelectCourse={course.onSelectCourse}
        onSelectJoinType={course.onSelectJoinType}
        onRemoveCourse={course.onRemoveCourse}
      />
      ));

    const courseSummary = this.selectedCourses().map((course) => {
      const joinTypeTexts = {
        student: 'Student',
        ta: 'TA',
        faculty: 'Faculty',
      };

      const joinTypeImages = {
        student: studentImg,
        ta: taImg,
        faculty: facultyImg,
      };

      return (
        <div className={s.courseSummaryCard}>
          <div>
            <span className={s.courseSummaryTitle}>{course.name}</span>
          </div>
          <div>
            <img
              className={s.joinTypeImage}
              src={joinTypeImages[course.joinType]}
              alt="join-type"
            />
            <span>{`Join as ${joinTypeTexts[course.joinType]}`}</span>
          </div>
        </div>
      );
    });

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

          {/* Select school */}
          {this.state.mode === SignUpModes.SCHOOL ?
              (<div>
                <h3 className={s.promptTitle}>Select your school</h3>
                <span>Search for your school below.</span>
                {
                    /* TODO: Replace the AutoCompleteSchool component below with
                     * a similar implementation of an AutoCompleteCourse component
                     */
                  }
                <AutoCompleteSchool onSelectSchool={this.onSelectSchool} />
              </div>) :
               null}
          {/* End of select school */}

          {/* Select courses */}
          {this.state.mode === SignUpModes.COURSES ?
              (<div>
                <h3 className={s.promptTitle}>
                   Select your courses at<br />{this.state.school.name}
                </h3>
                <span>Search for classes below.</span>
                <RaisedButton
                  className={s.editSchoolButton}
                  label="Edit School"
                  labelColor="#afafaf"
                  onClick={this.goEditSchool}
                />
                <div className={s.courseList}>
                  {courseList}
                </div>
              </div>) :
               null}
          {/* End of select courses */}

          {/* Summary */}
          {this.state.mode === SignUpModes.SUMMARY ?
              (<div>
                <div className={s.courseSummary}>
                  <h3 className={s.promptTitle}>
                     Your courses:
                   </h3>
                  {courseSummary}
                </div>
                <div className={s.profile}>
                  <h3 className={s.promptTitle}>
                     Enter your school email and password
                   </h3>
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
                </div>
              </div>) :
               null}
          {/* End of summary */}

          {this.state.errorNoCourses ?
            <span className={s.error}>{'Please join at least one course to proceed.'}</span> :
            null}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(s)(SignUpModal);
