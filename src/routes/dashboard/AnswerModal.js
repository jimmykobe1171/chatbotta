/**
 * /src/routes/dashboard/Dashboard.js
 *
 * Copyright © 2014-present Yuxuan Chen. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import s from './AnswerModal.css';

const muiTheme = getMuiTheme(baseTheme);

const textFieldStyle = {
  width: '80%',
};

class AnswerModal extends React.Component {
  static propTypes = {
    questionContent: PropTypes.string.isRequired,
    studentName: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    row: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      chatbotMessage: '',
      showAnswer: false,
      taAnswer: '',
    };
  }

  handleDropDown = () => {
    this.setState({
      showAnswer: !this.state.showAnswer,
    });
  }

  handleTaAnswerChange = (e) => {
    this.setState({
      taAnswer: e.target.value.replace(/\n$/, ''),
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div className={this.props.row} onClick={this.handleDropDown}>
            <span className={s.questionColumn}>
              {this.props.questionContent}</span>
            <span className={s.studentNameColumn}>{this.props.studentName}</span>
            <span className={s.dateColumn}>{this.props.updatedAt}
            </span>
          </div>
          {this.state.showAnswer ?
            <div className={s.dropDown}>
              <p className={s.chatbotAnswer}>chatbot answer here</p>
              <div className={s.textField}>
                <TextField
                  hintText="Your Answer"
                  multiLine
                  onChange={this.handleTaAnswerChange}
                  style={textFieldStyle}
                  value={this.state.taAnswer}
                />
                <RaisedButton
                  className={s.sendButton}
                  disabled={this.state.taAnswer === ''}
                  label="Send"
                  labelColor="#afafaf"
                  onClick={this.saveTaAnswer}
                  primary
                />
              </div>
            </div> : null}
        </div>
      </MuiThemeProvider>
    );
  }
}


export default withStyles(s)(AnswerModal);
