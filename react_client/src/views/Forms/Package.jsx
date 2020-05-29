import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import CustomSelect from "components/CustomSelect/CustomSelect.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.jsx";
import packaging from "assets/img/packaging.jpg";

import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import {UpdateData} from '../../services/UpdateData';
import {GetData} from '../../services/GetData';

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


class Package extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      errors: {},
      positions: [],
      package_name: "",
      package_position_name: "N/A",
      package_parts_amount:"",
      package_status:"N/A",
      button_value: "Add package"
    };
    this.updatePackage = this.updatePackage.bind(this);
  }

  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
      this.setState({redirect:true});
    }
    this.getPositions();
  }

  async updatePackage(e) {
    e.preventDefault();
    if(sessionStorage.getItem('user_token')){
      let data = {};
      data.user_id = sessionStorage.getItem('user_id');
      if(this.props.match.params.id !== "new"){
      let package_id = this.props.match.params.id;
      data.package_name = this.state.package_name;
      data.package_position_id = this.state.package_position_name;
      data.parts_amount = this.state.package_parts_amount;
      data.package_state = this.state.package_status;
      if (data) {
        UpdateData('packaging/' + package_id, data, sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON.status==="success"){
            const { history } = this.props;
            history.push('/admin/settings');
          }else{
          this.render();
        }
        });
      }
    }else{
      data.package_name = this.state.package_name;
      data.package_position_id = this.state.package_position_name;
      data.parts_amount = this.state.package_parts_amount;
      data.package_state = this.state.package_status;
      if (data) {
        PostData('packaging', data, sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON.status==="success"){
            const { history } = this.props;
            history.push('/admin/settings');
          }else{
          this.render();
        }
        });
      }
    }
    }
  }

  onChange(e){
          this.setState({
               [e.currentTarget.id]: e.currentTarget.value
          });
      }


  getPackage(){
    if(this.props.match.params.id !== "new"){
      this.setState({button_value:"Update package"});
    if(sessionStorage.getItem('user_token')){
      let package_id = this.props.match.params.id;
        GetData('packaging/' + package_id, sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
              this.setState({package_name: responseJSON.package_name}, () => {
                this.setState({package_position_name: responseJSON.package_position_id}, () => {
                  this.setState({package_parts_amount: responseJSON.parts_amount}, () => {
                    this.setState({package_status: responseJSON.package_state}, () => {
                      this.render();
                    });
                  });
                });
              });
          }else{
          this.render();
        }
        });
      }
    }else{this.render();}
  }

  getPositions(){
    if(sessionStorage.getItem('user_token')){
        GetData('positions', sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
            this.setState({positions_std: responseJSON});
            let positions=[{value: "N/A", name:"N/A"}];
            responseJSON.forEach(item => {
              let position={value: item._id, name: item.position_name};
              positions.push(position);
            });
            console.log(positions);
            this.setState({positions: positions}, () => {
              this.getPackage();
            });
          }
        });
      }
    }


  render() {
    if(this.state.redirect){
      return(<Redirect to={'/'}/>);
    }
    const { classes, name, email } = this.props;
    const { errors } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <form onSubmit={this.updatePackage}>
              <Card>
                <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Icon>
                    inbox
                  </Icon>
                </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Name"
                        id="package_name"
                        value= {this.state.package_name}
                        onChange={e => this.onChange(e)}
                        error={errors.name}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          defaultValue: name,
                          name: "name"
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                    <CustomSelect
                      labelText="Position"
                      id="package_position_name"
                      value = {this.state.package_position_name}
                      onChange={e => this.onChange(e)}
                      error={errors.username}
                      formControlProps={{
                        fullWidth: true
                      }}
                      optionsData = {this.state.positions}
                      inputProps={{
                        required: true,
                        defaultValue: email,
                        name: "position"
                      }}
                    />

                  </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Parts amount (pcs)"
                        id="package_parts_amount"
                        value = {this.state.package_parts_amount}
                        onChange={e => this.onChange(e)}
                        error={errors.name}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          defaultValue: name,
                          name: "amount"
                        }}
                      />
                  </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                      <CustomSelect
                        labelText="Status"
                        id="package_status"
                        value = {this.state.package_status}
                        onChange={e => this.onChange(e)}
                        error={errors.username}
                        formControlProps={{
                          fullWidth: true
                        }}
                        optionsData = {[
                          { value: 'N/A', name: 'N/A' },
                          { value: 'Confirmed', name: 'Confirmed' },
                          { value: 'Unconfirmed', name: 'Unconfirmed' },
                          { value: 'Removed', name: 'Removed' }
                        ]}
                        inputProps={{
                          required: true,
                          defaultValue: email,
                          name: "username"
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button type="submit" color="primary">
                    {this.state.button_value}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                  <img src={packaging} alt="Packaging" />
              </CardAvatar>
              <CardBody profile>
                <h4 className={classes.cardTitle}>Package</h4>
                <p className={classes.description}>
                  Physical representation of RFID tag, which is placed on bottom
                  of packaging. Status will be assigned automatically.
                  Please fill in the RFID identificator into the "Name" input, select
                  prefered position and fill in the amount of parts contained in the packaging.
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>);
  }
}

Package.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(Package);
