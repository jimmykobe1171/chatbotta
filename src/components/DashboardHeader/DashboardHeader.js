import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DashboardHeader.css';

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
    title: PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { open: false };
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={s.root}>
          <AppBar
            isInitiallyOpen={false}
            title={this.props.title}
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            <MenuItem>Advanced Software Engineering</MenuItem>
            <MenuItem>Machine Learning</MenuItem>
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
