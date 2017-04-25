/**
 * /src/routes/dashboard/Dashboard.js
 *
 * Copyright © 2014-present Yuxuan Chen. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import DashboardHeader from '../../components/DashboardHeader';

const muiTheme = getMuiTheme(baseTheme);

const largePaperStyle = {
  height: 500,
  width: 800,
  'margin-right': '20%',
  margin: '100px auto',
  textAlign: 'center',
  display: 'flex',
};

const smallPaperStyle = {
  'background-color': '#f2f2f2',
  height: 400,
  width: 800,
  textAlign: 'center',
};

class Dashboard extends React.Component {

  render() {
    return (
      <div>
        <DashboardHeader
          username={history.state.state.username}
          courses={history.state.state.courses}
        />
        <MuiThemeProvider muiTheme={muiTheme}>
          <Paper style={largePaperStyle} zDepth={4}>
            <Paper style={smallPaperStyle} zDepth={2} />
          </Paper>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Dashboard;
