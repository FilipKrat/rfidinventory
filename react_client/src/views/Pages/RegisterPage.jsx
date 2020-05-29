import React from "react";
import PropTypes from "prop-types";
import {Redirect} from 'react-router-dom';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import LockOpenIcon from '@material-ui/icons/LockOpen';

// @material-ui/icons
import PersonOutline from "@material-ui/icons/PersonOutline";
import Face from "@material-ui/icons/Face";

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
import registerPageStyle from "assets/jss/material-dashboard-react/views/registerPageStyle.jsx";


class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      errors: {}
    };
  }

  componentDidMount(){
    if(sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
  }
  register = async e => {
    e.preventDefault();

    const { history } = this.props;

    const fields = ["firstname", "lastname", "username", "password", "password_confirm"];
    const formElements = e.target.elements;

    const formValues = fields
      .map(field => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));

    if(formValues.password === formValues.password_confirm){
      let data = {};
      data.user_firstname = formValues.firstname;
      data.user_lastname = formValues.lastname;
      data.user_username = formValues.username;
      data.user_password = formValues.password;

      PostData('api/auth/add-user', data).then((result) => {
        let responseJSON = result;
        console.log(responseJSON);
        if(responseJSON){
          return history.push("/login-page");
        }else{
          console.log('signup err!');
        }

      });
    }else{

    }
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
        Welcome,<br/>
        It only takes a <span class="text-success">few seconds</span> to create your account.{" "}
        </h4>
        </GridItem>
      </GridContainer>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form onSubmit={this.register}>
              <Card className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="primary"
                >
                  <h4 className={classes.cardTitle}>Register</h4>
                </CardHeader>
                <CardBody>
                  <p className={classes.cardDescription}></p>
                  <CustomInput
                    labelText="Firstname"
                    id="firstname"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      required: true,
                      name: "firstname",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Lastname"
                    id="lastname"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      required: true,
                      name: "lastname",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    error={errors.username}
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
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    error={errors.password}
                    inputProps={{
                      required: true,
                      name: "password",
                      type: "password",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            <LockOpenIcon className={classes.inputAdornmentIcon} />
                          </Icon>
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password Confirmation"
                    id="password_confirm"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    error={errors.password}
                    inputProps={{
                      required: true,
                      name: "password_confirm",
                      type: "password",
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
                  <Button type="submit" color="primary" simple size="lg" block>
                    Sign up
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

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object
};

export default withStyles(registerPageStyle)(RegisterPage);
