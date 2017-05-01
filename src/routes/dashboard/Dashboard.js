/**
 * /src/routes/dashboard/Dashboard.js
 *
 * Copyright © 2014-present Yuxuan Chen. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DashboardHeader from '../../components/DashboardHeader';
import fetch from '../../core/fetch';
import history from '../../core/history';
import s from './Dashboard.css';

const muiTheme = getMuiTheme(baseTheme);

const largePaperStyle = {
  height: 500,
  width: 800,
  marginRight: '20%',
  margin: '100px auto',
  textAlign: 'center',
  display: 'flex',
};

const smallPaperStyle = {
  backgroundColor: '#f2f2f2',
  borderTop: '10px solid #a8cee2',
  height: 400,
  width: 800,
  textAlign: 'center',
};

const textFieldStyle = {
  width: '80%',
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      botMessageIds: [],
      courseIndex: 0,
      courses: [],
      dialog: [],
      inputValid: false,
      message: '',
      questions: [
        {
          content: 'Can I skip the final?',
          studentName: 'Qipeng Chen',
          updatedAt: '2017-04-30T16:00:18.741Z',
        },
        {
          content: 'Can I not submit the final project?',
          studentName: 'Qipeng Chen',
          updatedAt: '2017-04-30T16:00:18.741Z',
        },
        {
          content: 'Can I forget to reference in my final paper?',
          studentName: 'Qipeng Chen',
          updatedAt: '2017-04-30T16:00:18.741Z',
        },
        {
          content: 'Can I copy my classmate\'s homework?',
          studentName: 'Qipeng Chen',
          updatedAt: '2017-04-30T16:00:18.741Z',
        },
      ],
      username: '',
      userId: null,
    };

    // Get current user
    fetch('/api/current-user', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    }).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      const error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    })
      .then((resp) => {
        console.log('Dashboard - currentUser - SUCCESS', resp);
        this.setState({
          userId: resp.userId,
          username: resp.username,
          courses: resp.courses,
        });
      })
      .catch((e) => {
        console.log('Dashboard - currentUser - FAIL', e);
        history.push('/');
      });
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getChatbotMessage(), 1000);
  }

  onSelectCourse = (index) => {
    this.setState({ courseIndex: index });
  }

  async getChatbotMessage() {
    fetch(`/api/messages?userId=${this.state.userId}&courseId=${this.state.courses[this.state.courseIndex].id}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    }).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      const error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    }).then((resp) => {
      console.log('Dashboard - getChatbotMessage - SUCCESS', resp);
      resp.forEach((message) => {
        if (message.senderType === 'chatbot' &&
            this.state.botMessageIds.indexOf(message.id) === -1) {
          const dialog = this.state.dialog.slice();
          dialog.push(
            {
              sender: 'bot',
              content: message.content,
            },
          );
          const botMessageIds = this.state.botMessageIds.slice();
          botMessageIds.push(message.id);
          this.setState({
            botMessageIds,
            dialog,
          });
        }
      });
    }).catch((e) => {
      console.log('Dashboard - getChatbotMessage - FAIL', e);
    });
  }

  // TODO: Change the course ID to the correct one
  sendMessage = () => {
    const dialog = this.state.dialog.slice();
    dialog.push(
      {
        sender: 'user',
        content: this.state.message,
      },
    );
    this.setState({
      dialog,
    });

    fetch('/api/messages/', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        courseId: 1,
        content: this.state.message,
      }),
    }).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.json();
      }
      const error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    }).then((resp) => {
      console.log('Dashboard - sendMessage - SUCCESS', resp);
    })
    .catch((e) => {
      console.log('Dashboard - sendMessage - FAIL', e);
    });
  }

  handleMessageChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    const dialogMessages = this.state.dialog.map((message) => {
      const classNames = {
        bot: s.botMessage,
        user: s.userMessage,
      };

      return (<div className={classNames[message.sender]} >
        <span className={s.messageBubble}>
          {message.content}
        </span>
      </div>);
    });

    const questions = this.state.questions.map((question, idx) => (
      <div className={idx % 2 === 0 ? s.evenRow : s.oddRow}>
        <span className={s.questionColumn}>{question.content}</span>
        <span className={s.studentNameColumn}>{question.studentName}</span>
        <span className={s.dateColumn}>{(new Date(question.date)).toString()}</span>
      </div>));

    return (this.state.username ?
        (<div>
          <DashboardHeader
            username={this.state.username}
            courses={this.state.courses}
            onSelectCourse={this.onSelectCourse}
          />
          <MuiThemeProvider muiTheme={muiTheme}>
            <Paper style={largePaperStyle} zDepth={4}>
              {this.state.courses[this.state.courseIndex].joinType === 'student' ?
                (<Paper style={smallPaperStyle} zDepth={2}>
                  <div className={s.dialogView}>
                    {dialogMessages}
                  </div>
                  <div className={s.textField}>
                    <TextField
                      hintText="Your Message"
                      multiLine
                      onChange={this.handleMessageChange}
                      rows={5}
                      style={textFieldStyle}
                      value={this.state.message}
                    />
                    <RaisedButton
                      className={s.sendButton}
                      disabled={this.state.message === ''}
                      label="Send"
                      labelColor="#afafaf"
                      onClick={this.sendMessage}
                      primary
                    />
                  </div>
                </Paper>) :
                (
                  <div className={s.questionView}>
                    <div className={s.headerRow}>
                      <span className={s.questionColumn}>Question</span>
                      <span className={s.studentNameColumn}>Student Name</span>
                      <span className={s.dateColumn}>Date</span>
                    </div>
                    {questions}
                  </div>
                )
              }
            </Paper>
          </MuiThemeProvider>
        </div>) :
        null
    );
  }
}

export default withStyles(s)(Dashboard);
