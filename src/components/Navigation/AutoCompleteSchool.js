import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

export default class AutoCompleteSchool extends React.Component {
  static propTypes = {
    onSelectSchool: PropTypes.func.isRequired,
    school: PropTypes.shape.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      inputSchool: this.props.school ? this.props.school.name : '',
      schoolData: [],
      dataSource: [],
    };
    fetch('/api/schools', {
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
            schoolData: resp,
          });
          this.setState({
            dataSource: this.state.schoolData
                .map(school => ({
                  text: school.name,
                  value: (
                    <MenuItem
                      primaryText={school.name}
                    />
                  ),
                })),
          });
          console.log(
              'AutoCompleteSchool - Get Schools -  SUCCESS',
              this.state.dataSource);
        })
        .catch((e) => {
          console.log('AutoCompleteSchool - Get Schools - FAIL', e);
        });
  }

  onNewRequest = (chosenRequest, index) => {
    this.props.onSelectSchool(this.state.schoolData[index]);
  }

  handleUpdateInput = (newInput) => {
    this.setState({
      inputSchool: newInput,
    });
  }

  render() {
    return (
      <div>
        <AutoComplete
          filter={AutoComplete.fuzzyFilter}
          hintText="e.g. My University"
          dataSource={this.state.dataSource}
          fullWidth
          maxSearchResults={5}
          onNewRequest={this.onNewRequest}
          onUpdateInput={this.handleUpdateInput}
          searchText={this.state.inputSchool}
        />
      </div>
    );
  }
}
