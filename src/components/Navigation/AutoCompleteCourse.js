import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

export default class AutoCompleteCourse extends React.Component {
  static propTypes = {
    onSelectCourse: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      inputCourse: '',
      courseData: [],
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

  onNewRequest = (chosenRequest, index) => {
    this.props.onSelectCourse(this.state.courseData[index]);
  }

  render() {
    return (
      <div>
        <AutoComplete
          filter={AutoComplete.fuzzyFilter}
          hintText="e.g. My Course"
          dataSource={this.state.dataSource}
          fullWidth
          maxSearchResults={5}
          onNewRequest={this.onNewRequest}
        />
      </div>
    );
  }
}
