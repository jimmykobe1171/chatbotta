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
  marginLeft: '10px',
  width: '80%',
};

class AnswerModal extends React.Component {
  static propTypes = {
    questionContent: PropTypes.string.isRequired,
    studentName: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    row: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      chatbotAnswer: '',
      showAnswer: false,
      taAnswer: '',
    };
  }

  handleDropDown = () => {
    if (!this.state.showAnswer && this.state.chatbotAnswer === '') {
      fetch(`/api/questions/${this.props.questionId}/`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
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
        console.log('AnswerModal - handleDropDown - SUCCESS', resp);
        this.setState({
          chatbotAnswer: resp[1].content,
        });
      })
      .catch((err) => {
        console.log('AnswerModal - handleDropDown - FAIL', err);
      });
    }
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
              <div className={s.chatbotAnswerRow}>
                <span className={s.chatbotAnswer}>{`Chatbot's answer: ${this.state.chatbotAnswer}`}</span>
              </div>
              <div className={s.inputRow}>
                <TextField
                  hintText="Your answer"
                  multiLine
                  onChange={this.handleTaAnswerChange}
                  style={textFieldStyle}
                  value={this.state.taAnswer}
                />
                <div>
                  <RaisedButton
                    className={s.sendButton}
                    disabled={this.state.taAnswer === ''}
                    label="Send"
                    labelColor="#afafaf"
                    onClick={this.saveTaAnswer}
                    primary
                  />
                </div>
              </div>
            </div> :
            null}
        </div>
      </MuiThemeProvider>
    );
  }
}


export default withStyles(s)(AnswerModal);
