import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import {Redirect} from 'react-router-dom';
import {UpdateData} from '../../services/UpdateData';
import avatar from "assets/img/faces/user.png";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};


class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      user_firstname: sessionStorage.getItem("user_firstname"),
      user_lastname: sessionStorage.getItem("user_lastname"),
      user_username: sessionStorage.getItem("user_username"),
      user_password:"",
      user_conf_password: "",
      errors: {}
    };
    this.updateProfile = this.updateProfile.bind(this);
  }
  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
  }
  onChange(e){
          this.setState({
               [e.currentTarget.id]: e.currentTarget.value
          });
      }
      async updateProfile(e) {
        e.preventDefault();
        if(sessionStorage.getItem('user_token')){
          let data = {};
          let user_id = sessionStorage.getItem('user_id');
          data.user_firstname = this.state.user_firstname;
          data.user_lastname = this.state.user_lastname;
          data.user_username = this.state.user_username;
          if(this.state.user_password !== ""){
            if(this.state.user_password===this.state.user_conf_password){
              data.user_password = this.state.user_password;
            }
          }
          if (data) {
            UpdateData('api/auth/' + user_id, data, sessionStorage.getItem('user_token')).then((result) => {
              let responseJSON = result;
              if(responseJSON.status==="success"){
                sessionStorage.setItem("user_firstname",this.state.user_firstname);
                sessionStorage.setItem("user_lastname", this.state.user_lastname);
                sessionStorage.setItem("user_username",this.state.user_username);
                const { history } = this.props;
                history.push('/admin/user-profile');
              }else{
              this.render();
            }
            });
          }

        }
      }
  render() {

      if(this.state.redirect){
        return(<Redirect to={'/'}/>);
      }
    const { classes, name} = this.props;
    const { errors } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <form onSubmit={this.updateProfile}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                  <p className={classes.cardCategoryWhite}>
                    Your profile data
                  </p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Firstname"
                        id="user_firstname"
                        value = {this.state.user_firstname}
                        error={errors.name}
                        onChange={e => this.onChange(e)}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          defaultValue: name,
                          name: "user_firstname"
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Lastname"
                        id="user_lastname"
                        onChange={e => this.onChange(e)}
                        value = {this.state.user_lastname}
                        error={errors.username}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          defaultValue: name,
                          name: "user_lastname"
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Username"
                        id="user_username"
                        onChange={e => this.onChange(e)}
                        value = {this.state.user_username}
                        error={errors.username}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          defaultValue: name,
                          name: "user_username"
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="New Password"
                        id="user_password"
                        onChange={e => this.onChange(e)}
                        value = {this.state.user_password}
                        error={errors.username}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          required: false,
                          defaultValue: name,
                          name: "user_password"
                        }}
                      />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Confirm Password"
                          id="user_conf_password"
                          value = {this.state.user_conf_password}
                          onChange={e => this.onChange(e)}
                          error={errors.username}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "password",
                            required: false,
                            defaultValue: name,
                            name: "user_conf_password"
                          }}
                        />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button type="submit" color="primary">
                    Update Profile
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>{this.state.user_username}</h6>
                <h4 className={classes.cardTitle}>{this.state.user_firstname} {this.state.user_lastname}</h4>
                <p className={classes.description}>
                If you want to change your password, please fill in the input fields for "New password" and it's confirmation "Confirm password".
                </p>
                <p className={classes.description}>
                Thank you!
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(UserProfile);
