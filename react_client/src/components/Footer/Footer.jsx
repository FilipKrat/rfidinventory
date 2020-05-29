import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/admin" className={classes.block}>
                Dashboard
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/admin/statistics" className={classes.block}>
                Transactions & Export
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/admin/settings" className={classes.block}>
                Settings
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/admin/user-profile" className={classes.block}>
                Profile
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; Filip Kratochvíl, {1900 + new Date().getYear()}{" "}

          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
