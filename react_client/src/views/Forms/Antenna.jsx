import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomSelect from "components/CustomSelect/CustomSelect.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.jsx";
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import {UpdateData} from '../../services/UpdateData';
import {GetData} from '../../services/GetData';
import antenna from "assets/img/antenna.jpg";

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

class Antenna extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      errors: {},
      positions: [],
      antenna_name: "",
      antenna_position_name: "N/A",
      antenna_status: "N/A",
      button_value: "Add antenna"
    };
    this.updateAntenna = this.updateAntenna.bind(this);
  }

  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
    this.getPositions();
  }

  onChange(e){
          this.setState({
               [e.currentTarget.id]: e.currentTarget.value
          });
      }
  getAntenna(){
    if(this.props.match.params.id !== "new"){
        this.setState({button_value:"Update antenna"});
    if(sessionStorage.getItem('user_token')){
      let antenna_id = this.props.match.params.id;
        GetData('antennas/' + antenna_id, sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
              this.setState({antenna_name: responseJSON.antenna_name}, () => {
                this.setState({antenna_position_name: responseJSON.antenna_position_id}, () => {
                  this.setState({antenna_status: responseJSON.antenna_state}, () => {
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
            this.setState({positions: positions}, () => {
              this.getAntenna();
            });

          }else{
          this.getAntenna();
        }
        });
      }
    }

    async updateAntenna(e) {
      e.preventDefault();
      if(sessionStorage.getItem('user_token')){
        let data = {};
        if(this.props.match.params.id !== "new"){
        let antenna_id = this.props.match.params.id;
        data.antenna_name = this.state.antenna_name;
        data.antenna_position_id = this.state.antenna_position_name;
        data.antenna_state = this.state.antenna_status;
        if (data) {
          UpdateData('antennas/' + antenna_id, data, sessionStorage.getItem('user_token')).then((result) => {
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
        data.antenna_name = this.state.antenna_name;
        data.antenna_position_id = this.state.antenna_position_name;
        data.antenna_state = this.state.antenna_status;
        if (data) {
          PostData('antennas', data, sessionStorage.getItem('user_token')).then((result) => {
            let responseJSON = result;
            if(responseJSON.status==="success"){
              const { history } = this.props;
              history.push('/admin/settings');
            }else{
            console.log('msgs err!');
            this.render();
          }
          });
        }
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
            <form onSubmit={this.updateAntenna}>
              <Card>
                <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Icon>
                    settings_input_antenna
                  </Icon>
                </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Name"
                        id="antenna_name"
                        value={this.state.antenna_name}
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
                      id="antenna_position_name"
                      value={this.state.antenna_position_name}
                      onChange={e => this.onChange(e)}
                      error={errors.username}
                      formControlProps={{
                        fullWidth: true
                      }}
                      optionsData = {this.state.positions}
                      inputProps={{
                        required: true,
                        defaultValue: name,
                        name: "position"
                      }}
                    />
                  </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                      <CustomSelect
                        labelText="Status"
                        id="antenna_status"
                        value={this.state.antenna_status}
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
                          defaultValue: name,
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
                  <img src={antenna} alt="RFID Antenna" />
              </CardAvatar>
              <CardBody profile>
                <h4 className={classes.cardTitle}>Antenna</h4>
                <p className={classes.description}>
                  Antenna is placed on specific position and is assigning specific
                  status to packiging responding to antenna. Fill in the "Name"
                  input with the antenna identificator from RFID reader, then select
                  prefered status and position.
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Antenna.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(Antenna);
