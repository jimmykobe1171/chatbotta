import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
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
    onSelectCourse: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      courseIndex: 0,
    };
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  handleCourseSelection = (e, menuItem, index) => {
    this.setState({
      courseIndex: index,
      open: false,
    });
    this.props.onSelectCourse(index);
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
      history.push('/');
    })
      .catch((e) => {
        console.log('DashboardHeader - handleLogoutSubmit - FAIL', e);
        this.setState({ errorInvalidCred: true });
      });
  }


  render() {
    const courseItems = this.props.courses.map(course => (<MenuItem
      primaryText={course.name}
    />));

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={s.root}>
          <div className={s.header}>
            <span className={s.user}>{this.props.username}</span>
            <AppBar
              title={this.props.courses[this.state.courseIndex].name}
              onLeftIconButtonTouchTap={this.handleToggle}
              iconElementRight={
                <FlatButton
                  label="logout"
                  onClick={this.handleLogout}
                />}
            />
          </div>
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            <Menu
              onItemTouchTap={this.handleCourseSelection}
            >
              {this.state.open ? courseItems : null}
            </Menu>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(s)(DashboardHeader);
