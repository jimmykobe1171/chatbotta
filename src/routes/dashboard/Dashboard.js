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
      dialog: [
        {
          sender: 'user',
          content: 'What is the deadline for the next homework?',
        },
        {
          sender: 'bot',
          content: "It's May 11, next Monday.",
        },
        {
          sender: 'user',
          content: 'When and where is the final?',
        },
        {
          sender: 'bot',
          content: 'The final is on May 8 at Mudd.',
        },
        {
          sender: 'user',
          content: 'What is the deadline for the next homework?',
        },
        {
          sender: 'bot',
          content: "It's May 11, next Monday.",
        },
        {
          sender: 'user',
          content: 'When and where is the final?',
        },
        {
          sender: 'bot',
          content: 'The final is on May 8 at Mudd.',
        },
        {
          sender: 'user',
          content: 'What is the deadline for the next homework?',
        },
        {
          sender: 'bot',
          content: "It's May 11, next Monday.",
        },
        {
          sender: 'user',
          content: 'When and where is the final?',
        },
        {
          sender: 'bot',
          content: 'The final is on May 8 at Mudd.',
        },
        {
          sender: 'user',
          content: 'What is the deadline for the next homework?',
        },
        {
          sender: 'bot',
          content: "It's May 11, next Monday.",
        },
        {
          sender: 'user',
          content: 'When and where is the final?',
        },
        {
          sender: 'bot',
          content: 'The final is on May 8 at Mudd.',
        },
      ],
    };
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

    return (
      <div>
        <DashboardHeader
          username={history.location.state.username}
          courses={history.location.state.courses}
        />
        <MuiThemeProvider muiTheme={muiTheme}>
          <Paper style={largePaperStyle} zDepth={4}>
            <Paper style={smallPaperStyle} zDepth={2}>
              <div className={s.dialogView}>
                {dialogMessages}
              </div>
              <div className={s.textField}>
                <TextField
                  hintText="Your Message"
                  multiLine
                  rows={5}
                  style={textFieldStyle}
                />
                <RaisedButton
                  className={s.sendButton}
                  label="Send"
                  labelColor="#afafaf"
                  primary
                />
              </div>
            </Paper>
          </Paper>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withStyles(s)(Dashboard);
