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
import Popover from 'material-ui/Popover';
import Linkify from 'react-linkify';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import DashboardHeader from '../../components/DashboardHeader';
import AnswerModal from './AnswerModal';
import confusedImg from '../../images/confused.png';
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
      popoverOpen: false,
      snackbarOpen: false,
      questions: [],
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
        this.setupView();
      })
      .catch((e) => {
        console.log('Dashboard - currentUser - FAIL', e);
        history.push('/');
      });
  }

  onSelectCourse = (index) => {
    this.stopGettingChatbotMessage();
    this.setState({ courseIndex: index });
    if (this.state.courses[index].joinType === 'student') {
      this.startTimer();
    } else if (this.state.courses[index].joinType === 'ta') {
      this.getQuestions(index);
    }
  }

  getQuestions = (courseIndex) => {
    fetch(`/api/questions?courseId=${this.state.courses[courseIndex].id}&isTA=true`, {
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
        console.log('Dashboard - getQuestions - SUCCESS', resp);
        this.setState({
          questions: resp.map(question => ({
            id: question.id,
            content: question.content,
            studentName: question.studentEmail,
            updatedAt: question.updatedAt,
          })),
        });
      })
      .catch((e) => {
        console.log('Dashboard - getQuestions - FAIL', e);
      });
  }

  setupView = () => {
    if (this.state.courses[this.state.courseIndex].joinType === 'student') {
      this.startTimer();
    } else if (this.state.courses[this.state.courseIndex].joinType === 'ta') {
      this.getQuestions(this.state.courseIndex);
    }
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
      const dialog = this.state.dialog.slice();
      const botMessageIds = this.state.botMessageIds.slice();
      const dialogIsEmpty = dialog.length === 0;
      resp.forEach((message) => {
        if (!dialogIsEmpty &&
            message.senderType === 'chatbot' &&
            this.state.botMessageIds.indexOf(message.id) === -1) {
          dialog.push(
            {
              content: message.content,
              id: message.id,
              sender: 'chatbot',
            },
          );
        } else if (dialogIsEmpty) {
          if (message.senderType) {
            dialog.push(
              {
                content: message.content,
                id: message.id,
                sender: message.senderType,
              },
            );
          } else {
            dialog.push(
              {
                content: message.content,
                sender: 'student',
              },
            );
          }
        } else {
          return;
        }
        if (message.senderType === 'chatbot') {
          botMessageIds.push(message.id);
        }
      });

      const originalDialog = this.state.dialog.slice();
      this.setState({
        botMessageIds,
        dialog,
      });
      if (dialog.length > originalDialog.length) {
        this.dialogView.scrollTop = this.dialogView.scrollHeight;
      }
    }).catch((e) => {
      console.log('Dashboard - getChatbotMessage - FAIL', e);
    });
  }

  startTimer = () => {
    this.timer = setInterval(() => this.getChatbotMessage(), 1000);
  }

  stopGettingChatbotMessage = () => {
    clearInterval(this.timer);
  }

  sendMessage = () => {
    const dialog = this.state.dialog.slice();
    dialog.push(
      {
        sender: 'student',
        content: this.state.message,
      },
    );
    this.setState({
      dialog,
      message: '',
    });

    fetch('/api/messages/', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        courseId: this.state.courses[this.state.courseIndex].id,
        content: this.state.message,
      }),
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
      console.log('Dashboard - sendMessage - SUCCESS', resp);
      this.dialogView.scrollTop = this.dialogView.scrollHeight;
    })
    .catch((e) => {
      console.log('Dashboard - sendMessage - FAIL', e);
    });
  }

  markBotMessage = (e, menuItem, index) => {
    if (index === 0) {
      fetch(`/api/messages/${this.state.dialog[this.state.anchorBotMessageIdx].id}/`, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          chatbotAnswerStatus: 'unhelpful',
        }),
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
        console.log('Dashboard - markBotMessage - SUCCESS', resp);
      })
      .catch((err) => {
        console.log('Dashboard - markBotMessage - FAIL', err);
      });
      this.setState({
        snackbarOpen: true,
      });
    }
  }

  handleMessageChange = (e) => {
    this.setState({
      message: e.target.value.replace(/\n$/, ''),
    });
  }

  handleEnterKey = (e) => {
    if (e.key === 'Enter' && this.state.message !== '') {
      this.sendMessage();
    }
  }

  handleBotMessageTap = (e, messageIdx) => {
    e.preventDefault();

    this.setState({
      popoverOpen: true,
      anchorBotMessage: e.currentTarget,
      anchorBotMessageIdx: messageIdx,
    });
  }

  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false,
    });
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    const dialogMessages = this.state.dialog.map((message, messageIdx) => {
      const classNames = {
        chatbot: s.botMessage,
        student: s.userMessage,
        ta: s.taMessage,
      };

      return (<div className={classNames[message.sender]}>
        <div
          className={s.messageBubble}
          onTouchTap={e => (message.sender === 'chatbot' ? this.handleBotMessageTap(e, messageIdx) : null)}
        >
          <Linkify>
            {message.content}
          </Linkify>
        </div>
        {message.sender === 'chatbot' ?
          (<div>
            <Popover
              open={this.state.popoverOpen}
              anchorEl={this.state.anchorBotMessage}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handlePopoverClose}
            >
              <Menu
                onItemTouchTap={this.markBotMessage}
              >
                <MenuItem
                  primaryText="Mark as unhelpful"
                  leftIcon={<img src={confusedImg} alt="confused-icon" />}
                />
              </Menu>
            </Popover>
            <Snackbar
              open={this.state.snackbarOpen}
              message="The chatbot TA's answer has been successfully marked as unhelpful."
              autoHideDuration={4000}
              onRequestClose={this.handleSnackbarClose}
            />
          </div>) : null}
      </div>);
    });

    const questions = this.state.questions.map((question, idx) => (
      <AnswerModal
        className={idx % 2 === 0 ? s.evenRow : s.oddRow}
        row={idx % 2 === 0 ? s.evenRow : s.oddRow}
        questionId={question.id}
        questionContent={question.content}
        studentName={question.studentName}
        updatedAt={(new Date(question.updatedAt)).toLocaleDateString()}
      />
    ));

    return (this.state.username ?
        (<div>
          <DashboardHeader
            username={this.state.username}
            courses={this.state.courses}
            onSelectCourse={this.onSelectCourse}
            onLogOut={this.stopGettingChatbotMessage}
          />
          <MuiThemeProvider muiTheme={muiTheme}>
            <Paper style={largePaperStyle} zDepth={4}>
              {this.state.courses[this.state.courseIndex].joinType === 'student' ?
                (<Paper style={smallPaperStyle} zDepth={2}>
                  <div
                    className={s.dialogView}
                    ref={(ref) => { this.dialogView = ref; }}
                  >
                    {dialogMessages}
                  </div>
                  <div className={s.textField}>
                    <TextField
                      hintText="Your Message"
                      multiLine
                      onChange={this.handleMessageChange}
                      onKeyDown={this.handleEnterKey}
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
                      <span className={s.questionColumn}>{'Question'}</span>
                      <span className={s.studentNameColumn}>{'Student Name'}</span>
                      <span className={s.dateColumn}>{'Date'}</span>
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
