import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AutoComplete from 'material-ui/AutoComplete';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import penImg from '../../images/pen.png';
import trashImg from '../../images/trash.png';
import s from './AutoCompleteCourse.css';

const styles = {
  radioButton: {
    width: '45%',
  },
  radioButtonGroup: {
    display: 'inline-flex',
  },
  editButton: {
    marginRight: '-20px',
  },
};

class AutoCompleteCourse extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onSelectCourse: PropTypes.func.isRequired,
    onSelectJoinType: PropTypes.func.isRequired,
    onRemoveCourse: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      inputCourse: '',
      course: null,
      courseData: [],
      courseSelected: false,
      dataSource: [],
    };
    fetch('/api/courses', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
        .then((resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            return resp.json();
          }
          const error = new Error(resp.statusText);
          error.response = resp;
          throw error;
        })
        .then((resp) => {
          this.setState({
            courseData: resp,
          });
          this.setState({
            dataSource: this.state.courseData
                .map(course => ({
                  text: course.name,
                  value: (
                    <MenuItem
                      primaryText={course.name}
                    />
                  ),
                })),
          });
          console.log(
              'AutoCompleteCourse - Get Courses -  SUCCESS',
              this.state.dataSource);
        })
        .catch((e) => {
          console.log('AutoCompleteCourse - Get Courses - FAIL', e);
        });
  }

  onNewRequest = (chosenRequest, idx) => {
    this.setState({
      course: this.state.courseData[idx],
      courseSelected: true,
    });
    this.props.onSelectCourse(this.state.course, this.props.index);
  }

  editCourse = () => {
    this.setState({
      course: null,
      courseSelected: false,
    });
    this.props.onSelectCourse(null, this.props.index);
  }

  editJoinType = (e, selectedJoinType) => {
    this.props.onSelectJoinType(selectedJoinType, this.props.index);
  }

  removeCourse = () => {
    this.props.onRemoveCourse(this.props.index);
  }

  render() {
    return (
      <div>
        {!this.state.courseSelected ?
          <AutoComplete
            filter={AutoComplete.fuzzyFilter}
            hintText="e.g. My Course"
            dataSource={this.state.dataSource}
            fullWidth
            maxSearchResults={5}
            onNewRequest={this.onNewRequest}
          /> :
            (<div className={s.selectedCourse}>
              <div>
                <span className={s.courseName}>{this.state.course.name}</span>
              </div>
              <div>
                <span>Join as:</span>
              </div>
              <RadioButtonGroup
                defaultSelected="student"
                name="joinType"
                onChange={this.editJoinType}
                style={styles.radioButtonGroup}
              >
                <RadioButton
                  label="Student"
                  value="student"
                  style={styles.radioButton}
                />
                <RadioButton
                  label="TA"
                  value="ta"
                  style={styles.radioButton}
                />
                <RadioButton
                  label="Faculty"
                  value="faculty"
                  style={styles.radioButton}
                />
              </RadioButtonGroup>
              <div className={s.courseControlGroup}>
                <IconButton
                  className={s.courseControl}
                  onClick={this.removeCourse}
                  tooltip="Remove Course"
                  tooltipPosition="top-left"
                  touch
                >
                  <img className={s.trashImg} alt="remove-course" src={trashImg} />
                </IconButton>
                <IconButton
                  className={s.courseControl}
                  onClick={this.editCourse}
                  style={styles.editButton}
                  tooltip="Edit Course"
                  tooltipPosition="top-left"
                  touch
                >
                  <img className={s.penImg} alt="edit-course" src={penImg} />
                </IconButton>
              </div>
            </div>)}
      </div>
    );
  }
}

export default withStyles(s)(AutoCompleteCourse);
