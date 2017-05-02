/**
 * /src/routes/dashboard/Dashboard.js
 *
 * Copyright © 2017-present Yuxuan Chen. All rights reserved.
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
import IconButton from 'material-ui/IconButton';
import DashboardHeader from '../../components/DashboardHeader';
import AnswerModal from './AnswerModal';
import confusedImg from '../../images/confused.png';
import robotImg from '../../images/robot.png';
import refreshImg from '../../images/refresh.png';
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
      nonUserMessageIds: [],
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
    if (index === this.state.courseIndex) {
      return;
    }
    this.stopGettingChatbotMessage();
    this.setState({
      nonUserMessageIds: [],
      courseIndex: index,
      dialog: [],
      inputValid: false,
      message: '',
    });
    if (this.state.courses[index].joinType === 'student') {
      this.startTimer(index);
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
      this.startTimer(this.state.courseIndex);
    } else if (this.state.courses[this.state.courseIndex].joinType === 'ta') {
      this.getQuestions(this.state.courseIndex);
    }
  }

  async getChatbotMessage(courseIndex) {
    fetch(`/api/messages?userId=${this.state.userId}&courseId=${this.state.courses[courseIndex].id}`, {
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
      const nonUserMessageIds = this.state.nonUserMessageIds.slice();
      const dialogIsEmpty = dialog.length === 0;
      resp.forEach((message) => {
        if ((!dialogIsEmpty &&
             message.senderType &&
             this.state.nonUserMessageIds.indexOf(message.id) === -1) ||
            (dialogIsEmpty)) {
          dialog.push(
            {
              content: this.formatMessageContent(message, dialog),
              id: message.id,
              senderType: message.senderType ? message.senderType : 'student',
              senderEmail: message.senderEmail,
            },
          );
        }
        if (message.senderType) {
          nonUserMessageIds.push(message.id);
        }
      });

      const originalDialog = this.state.dialog.slice();
      this.setState({
        nonUserMessageIds,
        dialog,
      });
      if (dialog.length > originalDialog.length) {
        this.dialogView.scrollTop = this.dialogView.scrollHeight;
      }
    }).catch((e) => {
      console.log('Dashboard - getChatbotMessage - FAIL', e);
    });
  }

  formatMessageContent = (message, dialog) => {
    if (message.senderType !== 'ta') {
      return message.content;
    }
    // TODO: Deal with the fact that the API doesn't return an ID for message
    return `To your question "${dialog[message.questionId - 1].content}", your TA ${message.senderEmail} said: ${message.content}`;
  }

  startTimer = (courseIndex) => {
    this.timer = setInterval(() => this.getChatbotMessage(courseIndex), 1000);
  }

  stopGettingChatbotMessage = () => {
    clearInterval(this.timer);
  }

  sendMessage = () => {
    const dialog = this.state.dialog.slice();
    dialog.push(
      {
        senderType: 'student',
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
        this.setState({
          popoverOpen: false,
          snackbarOpen: true,
        });
      })
      .catch((err) => {
        console.log('Dashboard - markBotMessage - FAIL', err);
      });
    }
  }

  refresh = () => {
    this.getQuestions(this.state.courseIndex);
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
    // If click on a link
    if (e.target.tagName === 'A') {
      return;
    }

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

      const linkStyle = {
        style: {
          color: message.senderType === 'chatbot' ? 'black' : 'white',
        },
        target: '_blank',
      };

      return (<div className={classNames[message.senderType]}>
        <div
          className={s.messageBubble}
          onTouchTap={e => (message.senderType === 'chatbot' ? this.handleBotMessageTap(e, messageIdx) : null)}
        >
          <Linkify properties={linkStyle}>
            {message.content}
          </Linkify>
        </div>
        {message.senderType === 'chatbot' ?
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
                (this.state.questions.length > 0 ?
                   (<div className={s.questionView}>
                     <div className={s.headerRow}>
                       <span className={s.questionColumn}>{'Question'}</span>
                       <span className={s.studentNameColumn}>{'Student Name'}</span>
                       <span className={s.dateColumn}>{'Date'}</span>
                       <IconButton
                         className={s.refreshButtonWithQuestions}
                         onTouchTap={this.refresh}
                         tooltip="Refresh"
                         tooltipPosition="bottom-center"
                       >
                         <img
                           className={s.refreshImg}
                           src={refreshImg}
                           alt="refresh"
                         />
                       </IconButton>
                     </div>
                     {questions}
                   </div>) :
                  (<div>
                    <div>
                      <IconButton
                        className={s.refreshButtonWithNoQuestions}
                        onTouchTap={this.refresh}
                        tooltip="Refresh"
                        tooltipPosition="bottom-center"
                      >
                        <img
                          className={s.refreshImg}
                          src={refreshImg}
                          alt="refresh"
                        />
                      </IconButton>
                    </div>
                    <img
                      className={s.robotImg}
                      src={robotImg}
                      alt="robot-img"
                    />
                    <div className={s.defaultMsg}>
                      <span>
                        {'The chatbot TA is so smart that he correctly ' +
                          "answered all of the students' questions. Go " +
                          'watch your favorite HBO show and come back later.'}
                      </span>
                    </div>
                  </div>)
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
