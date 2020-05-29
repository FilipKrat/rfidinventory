import React from "react";
import PropTypes from "prop-types";
import {Redirect} from 'react-router-dom';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import PersonOutline from "@material-ui/icons/PersonOutline";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import {PostData} from '../../services/PostData';
import loginPageStyle from "assets/jss/material-dashboard-react/views/loginPageStyle.jsx";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      redirect: false,
      errors: {}
    };
  }

  componentDidMount(){
    if(sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
  }

  login = async e => {
    e.preventDefault();

    const { history } = this.props;

    const fields = ["username", "password"];
    const formElements = e.target.elements;

    const formValues = fields
      .map(field => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));
      let data = {};
      data.user_username = formValues.username;
      data.user_password = formValues.password;

      PostData('api/auth/login', data).then((result) => {
        let responseJSON = result;
        if(responseJSON){
          let user_data = responseJSON;
          if(user_data.auth === true){
          sessionStorage.setItem('user_token',user_data.user_token);
          sessionStorage.setItem('user_username',user_data.user_username);
          sessionStorage.setItem('user_id',user_data.user_id);
          sessionStorage.setItem('user_firstname', user_data.user_firstname);
          sessionStorage.setItem('user_lastname',user_data.user_lastname);
          return history.push("/admin/dashboard");
        }else{}
        }else{
          console.log('login err!');
        }
      });
  };
  handleToggle = value => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };


  render() {
    if(this.state.redirect){
      return(<Redirect to={'/admin/dashboard'}/>);
    }
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={8}>
            <h4 className={classes.textCenter} style={{ marginTop: 0 }}>
              Welcome back,<br/>
              Please sign in to your account below.{" "}
            </h4>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form onSubmit={this.login}>
              <Card className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="info"
                >
                  <h4 className={classes.cardTitle}>Log in</h4>

                </CardHeader>
                <CardBody>
                  <p
                    className={`${classes.textCenter} ${classes.checkboxLabel}`}
                  >
                  </p>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    error={errors.username || errors.invalidEmailOrPassword}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      required: true,
                      name: "username",
                      endAdornment: (
                        <InputAdornment position="end">
                        <PersonOutline className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="password"
                    error={errors.password || errors.invalidEmailOrPassword}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      type: "password",
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      )
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button type="submit" color="info" simple size="lg" block>
                    Log in
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  errors: PropTypes.object
};

export default withStyles(loginPageStyle)(LoginPage);
