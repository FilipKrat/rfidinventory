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
import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.jsx";
import position from "assets/img/position.jpg";
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


class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      errors: {},
      position_name:"",
      position_description:"",
      position_capacity:"",
      button_value: "Add position"
    };
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
    this.getPosition();
  }

  async updatePosition(e) {
    e.preventDefault();
    if(sessionStorage.getItem('user_token')){
      let data = {};
      if(this.props.match.params.id !== "new"){
      let position_id = this.props.match.params.id;
      data.position_name = this.state.position_name;
      data.position_desc = this.state.position_description;
      data.position_capacity = this.state.position_capacity;
      if (data) {
        UpdateData('positions/' + position_id, data, sessionStorage.getItem('user_token')).then((result) => {
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
      data.position_name = this.state.position_name;
      data.position_desc = this.state.position_description;
      data.position_capacity = this.state.position_capacity;
      if (data) {
        PostData('positions', data, sessionStorage.getItem('user_token')).then((result) => {
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

  getPosition(){
    if(this.props.match.params.id !== "new"){
      this.setState({button_value:"Update position"});
    if(sessionStorage.getItem('user_token')){
      let position_id = this.props.match.params.id;
        GetData('positions/' + position_id, sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
              this.setState({position_name: responseJSON.position_name}, () => {
                this.setState({position_description: responseJSON.position_description}, () => {
                  this.setState({position_capacity: responseJSON.position_capacity}, () => {
                      this.render();
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
              <form onSubmit={this.updatePosition}>
                <Card>
                  <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Icon>
                      pin_drop
                    </Icon>
                  </CardIcon>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Name"
                          id="position_name"
                          value={this.state.position_name}
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
                        <CustomInput
                          labelText="Description"
                          id="position_description"
                          value={this.state.position_description}
                          onChange={e => this.onChange(e)}
                          error={errors.name}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            required: true,
                            defaultValue: name,
                            name: "description"
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Capacity (pcs)"
                          id="position_capacity"
                          value={this.state.position_capacity}
                          onChange={e => this.onChange(e)}
                          error={errors.name}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            required: true,
                            defaultValue: name,
                            name: "capacity"
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
                    <img src={position} alt="Position" />
                </CardAvatar>
                <CardBody profile>
                  <h4 className={classes.cardTitle}>Position</h4>
                  <p className={classes.description}>
                    Single position in horizontal warehouse, in which is stored
                    one type of parts. Please fill in the "Description" input, with
                    part number of stored parts, the "Name" input, with position number
                    and the "Capacity" fill in with amount of parts in packaging, times number
                    of possible packaging in the position.
                  </p>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
    );
  }
}

Position.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(Position);
