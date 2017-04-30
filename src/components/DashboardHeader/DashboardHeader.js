import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DashboardHeader.css';
import history from '../../core/history';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#a8cee2',
  },
  appBar: {
    height: 60,
  },
});

class DashboardHeader extends React.Component {
  static propTypes = {
    courses: PropTypes.shape.isRequired,
    username: PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      courseIndex: 0,
    };
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  handleCourseSelection = (e, menuItem, index) => {
    /* this.setState({ courseIndex: index }); */
    console.log('select course: ', index);
  }

  handleLogout = () => {
    fetch('/api/logout', {
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
      console.log('DashboardHeader - handleLogoutSubmit - SUCCESS', resp);
      history.push(
        '/',
      );
    })
      .catch((e) => {
        console.log('DashboardHeader - handleLogoutSubmit - FAIL', e);
        this.setState({ errorInvalidCred: true });
      });
  }


  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={s.root}>
          <AppBar
            isInitiallyOpen={false}
            title={this.props.courses[this.state.courseIndex].name}
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={<FlatButton label="logout" onClick={this.handleLogout} />}
          />
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            {this.props.courses.map(course => (
              <MenuItem
                primaryText={course.name}
                onClick={() => console.log('touch1')}
              />))}
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

DashboardHeader.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default withStyles(s)(DashboardHeader);
