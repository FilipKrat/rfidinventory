import React from "react";
import PropTypes from "prop-types";
import {Redirect} from 'react-router-dom';
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import DateRange from "@material-ui/icons/DateRange";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import BarChart from "components/Charts/BarCharts.jsx";
import {GetData} from '../../services/GetData';


import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  state = {
    value: 0,
    redirect:false,
    packages: [],
    positions_std: [],
    positions: [],
    confirmed: [],
    unconfirmed: [],
    removed: [],
    fullness: 0,
    total_capacity: 0,
    production: 0,
    orders: 0
  };
  interval = null;
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
      this.interval = setInterval(() => this.getPositions(), 120000);
      this.getPositions();
      this.render();
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    getPositions(){
      if(sessionStorage.getItem('user_token')){
          GetData('positions', sessionStorage.getItem('user_token')).then((result) => {
            let responseJSON = result;
            if(responseJSON){
              this.setState({positions_std: responseJSON}, () => {
              let positions=[];
              let capacity=0;
              responseJSON.forEach(item => {
                let position=item.position_name;
                capacity += parseInt(item.position_capacity);
                positions.push(position);
              });
              this.setState({positions: positions}, () => {
                this.setState({total_capacity: capacity}, () => {
                  this.getPackages();
                });
              });
            });
            }else{
            console.log('msgs err!');
          }
          });
        }
      }

      getLogs(){
        if(sessionStorage.getItem('user_token')){
            GetData('history', sessionStorage.getItem('user_token')).then((result) => {
              let responseJSON = result;
              if(responseJSON){
                this.setState({logs_std: responseJSON}, () => {
                let production = 0;
                let orders = 0;
                responseJSON.forEach(item => {
                  if(item.position_state==="Removed"){
                    orders += parseInt(item.parts_amount);
                  }
                  if(item.position_state==="Confirmed"){
                    production += parseInt(item.parts_amount);
                  }
                });
                this.setState({production: production}, () => {
                  this.setState({orders: orders}, () => {
                    this.render();
                  });
                });
              });
              }else{
              console.log('msgs err!');
              this.render();
            }
            });
          }
        }

        getRemoved(){
          if(sessionStorage.getItem('user_token')){
              GetData('history/recent', sessionStorage.getItem('user_token')).then((result) => {
                let responseJSON = result;
                if(responseJSON){
                  let removed = [];
                  this.state.positions_std.forEach(position => {
                  let removed_count = 0;
                  let position_name = position.position_name;
                  responseJSON.forEach(item => {
                    if(position_name === item.position_name && item.position_state==="Removed"){
                        removed_count += parseInt(item.parts_amount);
                    }
                  });
                  removed.push(removed_count);
                });
                  this.setState({removed: removed}, () => {
                      this.getLogs();
                  });

                }else{
                console.log('msgs err!');
                this.getLogs();
              }
              });
            }
          }

      getPackages(){
        if(sessionStorage.getItem('user_token')){
            GetData('packaging', sessionStorage.getItem('user_token')).then((result) => {
              let responseJSON = result;
              if(responseJSON){
                let confirmed = [];
                let unconfirmed = [];
                let total_count = 0;
                this.state.positions_std.forEach(position => {
                  let position_id = position._id;
                  let confirmedCount = 0;
                  let unconfirmedCount = 0;
                responseJSON.forEach(item => {
                  if(position_id === item.package_position_id){
                    if(item.package_state === "Unconfirmed"){
                        unconfirmedCount += parseInt(item.parts_amount);
                        total_count += parseInt(item.parts_amount);
                    }
                    if(item.package_state === "Confirmed"){
                        confirmedCount += parseInt(item.parts_amount);
                        total_count += parseInt(item.parts_amount);
                      }
                    }
                });
                  confirmed.push(confirmedCount);
                  unconfirmed.push(unconfirmedCount);
                });
                let fullness = (100/this.state.total_capacity)*total_count;
                this.setState({packages: responseJSON}, () => {
                  this.setState({confirmed: confirmed}, () => {
                    this.setState({unconfirmed: unconfirmed}, () => {
                      this.setState({fullness: fullness.toFixed(2)}, () => {
                        this.getRemoved();
                      });
                    });
                  });
                });
              }else{
              console.log('msgs err!');
              this.getRemoved();
            }
            });
          }
        }

  render() {
    if(this.state.redirect){
      return(<Redirect to={'/'}/>);
    }

    const { classes } = this.props;
    return (
      <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Icon>add_circle_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Production</p>
              <h3 className={classes.cardTitle}>{this.state.production}<small> pcs</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>remove_circle_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Orders</p>
              <h3 className={classes.cardTitle}>{this.state.orders}<small> pcs</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Average Fullness</p>
              <h3 className={classes.cardTitle}>{this.state.fullness}<small> %</small></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Now
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        </GridContainer>

      <GridContainer>

        <GridItem xs={10} sm={10} md={10}>
        <Card>
        <CardHeader>
        <BarChart positions={this.state.positions} confirmed={this.state.confirmed} unconfirmed={this.state.unconfirmed} removed ={this.state.removed} />
            </CardHeader>
          </Card>
        </GridItem>

      </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
