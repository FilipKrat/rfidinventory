import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import {Redirect} from 'react-router-dom';
import {GetData} from '../../services/GetData';
import {DeleteData} from '../../services/DeleteData';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class SettingsTableList extends React.Component {
  state = {
    redirect: false,
    positions_std: [],
    positions: [],
    antennas: [],
    packages: [],
    dir_id: ""
  };
  editPosition = async e => {
    e.preventDefault();
    const { history } = this.props;
    history.push('/admin/position/'+ e.currentTarget.value);
  }
  editAntenna = async e => {
    const { history } = this.props;
    history.push('/admin/antenna/'+e.currentTarget.value);
  }
  editPackage = async e => {
    const { history } = this.props;
    history.push('/admin/package/'+e.currentTarget.value);
  }

removePosition = async e =>{
  if(sessionStorage.getItem('user_token')){
    let position_id = e.currentTarget.value;
      DeleteData('positions/' + position_id, sessionStorage.getItem('user_token')).then((result) => {
        let responseJSON = result;
        if(responseJSON.status === "success"){
            this.getPositions();
            this.render();
        }else{
        this.render();
      }
      });
    }
}
removeAntenna = async e =>{
  if(sessionStorage.getItem('user_token')){
    let antenna_id = e.currentTarget.value;
      DeleteData('antennas/' + antenna_id, sessionStorage.getItem('user_token')).then((result) => {
        let responseJSON = result;
        if(responseJSON.status === "success"){
            this.getAntennas();
            this.render();
        }else{
        console.log('msgs err!');
        this.render();
      }
      });
    }
}
removePackage = async e => {
  if(sessionStorage.getItem('user_token')){
    let package_id = e.currentTarget.value;
      DeleteData('packaging/' + package_id, sessionStorage.getItem('user_token')).then((result) => {
        let responseJSON = result;
        if(responseJSON.status === "success"){
            this.getPackages();
            this.render();
        }else{
        console.log('msgs err!');
        this.render();
      }
      });
    }
}

componentDidMount(){
  if(!sessionStorage.getItem("user_token")){
      this.setState({redirect:true});
    }
  this.getPositions();

}

getAntennas(){
  if(sessionStorage.getItem('user_token')){
      GetData('antennas', sessionStorage.getItem('user_token')).then((result) => {
        let responseJSON = result;
        if(responseJSON){
          let antennas = [];
          responseJSON.forEach(item => {
            let position = "";
            if(item.antenna_position_id !== "N/A"){
              position = this.state.positions_std.find(x => x._id === item.antenna_position_id).position_name;
            }else{
              position = "N/A";
            }
            let antenna =[item._id, item.antenna_name, position ,item.antenna_state, <Button variant="outlined" color="info" size="sm" value={item._id} onClick={this.editAntenna}>Edit</Button>,<Button variant="outlined" color="warning" size="sm" value={item._id} onClick={this.removeAntenna}>Remove</Button>]
            antennas.push(antenna);
          });
          this.setState({antennas: antennas}, () => {
            this.getPackages();
          });
        }else{
        this.getPackages();
      }
      });
    }
  }

  getPackages(){
    if(sessionStorage.getItem('user_token')){
        GetData('packaging', sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
            let packages = [];
            responseJSON.forEach(item => {
              let date = new Date(item.package_timestamp * 1000);
              let formattedDate = ('0' + date.getDate()).slice(-2) + '. ' + ('0' + (date.getMonth() + 1)).slice(-2) + '. ' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
              let position = "";
              if(item.package_position_id !== "N/A"){
                position = this.state.positions_std.find(x => x._id === item.package_position_id).position_name;
              }else{
                position = "N/A";
              }
              let packaging =[item._id, item.package_name, position ,item.parts_amount,formattedDate,item.package_state, <Button variant="outlined" color="info" size="sm" value={item._id} onClick={this.editPackage}>Edit</Button>,<Button variant="outlined" color="warning" size="sm" value={item._id} onClick={this.removePackage}>Remove</Button>]
              packages.push(packaging);
            });
            this.setState({packages: packages}, () => {
              this.render();
            });
          }else{
          this.render();
        }
        });
      }
    }

  getPositions(){
    if(sessionStorage.getItem('user_token')){
        GetData('positions', sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
            this.setState({positions_std: responseJSON}, () => {
            let positions=[];
            responseJSON.forEach(item => {
              let position=[item._id, item.position_name, item.position_description, item.position_capacity, <Button variant="outlined" color="info" size="sm" value={item._id} onClick={this.editPosition}>Edit</Button>,<Button variant="outlined" color="warning" size="sm" value={item._id} onClick={this.removePosition}>Remove</Button>]
              positions.push(position);
            });
            this.setState({positions: positions}, () => {
              this.getAntennas();
            });
          });
          }else{
          console.log('msgs err!');
          this.getAntennas();
        }
        });
      }
    }

    getPositionById(id){
      if(sessionStorage.getItem('user_token')){
        let position_id = id;
          GetData('positions/'+ position_id, sessionStorage.getItem('user_token')).then((result) => {
            let responseJSON = result;
            if(responseJSON){
              return responseJSON;
            }
          });

          }
        }

render(){
  if(this.state.redirect){
    return(<Redirect to={'/'}/>);
  }
  const { classes } = this.props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="success">
            <h4 className={classes.cardTitleWhite}>Positions</h4>
            <p className={classes.cardCategoryWhite}>
              The packages with parts are stored at positions below
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="black"
              tableHead={["Id", "Name", "Description","Capacity (pcs)", "", ""]}
              tableData={this.state.positions}
            />
          </CardBody>
          <Button variant="outlined" color="info" size="sm" value="new" onClick={this.editPosition}>Add New Position</Button>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>Antennas</h4>
          <p className={classes.cardCategoryWhite}>
            Antennas used for scanning incoming, stored and outcoming packages
          </p>
        </CardHeader>
        <CardBody>
          <Table
            tableHeaderColor="black"
            tableHead={["Id", "Name", "Position", "Status", "", ""]}
            tableData={this.state.antennas}
          />
        </CardBody>

        <Button variant="outlined" color="info" size="sm" value="new" onClick={this.editAntenna}>Add New Antenna</Button>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>Packages</h4>
          <p className={classes.cardCategoryWhite}>
           Package IDs connected with specific positions below
          </p>
        </CardHeader>
        <CardBody>
          <Table
            tableHeaderColor="black"
            tableHead={["Id", "Name", "Position","Parts (pcs)","Last change","Status", "", ""]}
            tableData={this.state.packages}
          />
        </CardBody>

        <Button variant="outlined" color="info" size="sm" value="new" onClick={this.editPackage}>Add New Package</Button>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
}

export default withStyles(styles)(SettingsTableList);
