import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";
// core components
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";

class HeaderLinks extends React.Component {
  state = {
    open: false,
    profilePopupOpen: false,
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open, profilePopupOpen: false }));
  };
  handleDashboardRedirect = () => {
    const { history } = this.props;
    history.push('/admin/dashboard');
  };
  redirectSettings = () => {
    this.setState({ open: false, profilePopupOpen: false });
    const { history } = this.props;
    history.push('/admin/settings');
  };
  handleToggleProfile = () => {
    this.setState(state => ({ profilePopupOpen: !state.profilePopupOpen, open: false }));
  };
  handleClose = event => {
    this.setState({ open: false, profilePopupOpen: false });
    if (this.anchorEl.contains(event.target)) {
      return;
    }
  };
  logout = async () => {
    const { history } = this.props;
    sessionStorage.setItem("user_token",'');
    sessionStorage.setItem("user_id",'');
    sessionStorage.setItem("user_firstname",'');
    sessionStorage.setItem("user_lastname",'');
    sessionStorage.clear();
    history.push('/auth/login-page');
  }
  render() {
    const { classes } = this.props;
    const { profilePopupOpen } = this.state;
    return (
      <div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          onClick={this.handleDashboardRedirect}
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
          <Button
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-label="Person"
            aria-owns={profilePopupOpen ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={profilePopupOpen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !profilePopupOpen }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList role="menu">
                      <NavLink to="/admin/user-profile">
                        <MenuItem
                          onClick={this.handleClose}
                          className={classes.dropdownItem}
                        >
                          Profile
                        </MenuItem>
                      </NavLink>
                      <MenuItem
                        onClick={this.redirectSettings}
                        className={classes.dropdownItem}
                      >
                        Settings
                      </MenuItem>
                      <NavLink to="/admin/settings">
                      <MenuItem
                        onClick={this.logout}
                        className={classes.dropdownItem}
                      >
                        Logout
                      </MenuItem>
                      </NavLink>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
