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
import XLSX from 'xlsx';
import {Redirect} from 'react-router-dom';
import Button from "components/CustomButtons/Button.jsx";
import {GetData} from '../../services/GetData';

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

class TableList extends React.Component {
  state = {
    redirect:false,
    logs_std: [],
    logs: [],
    cols: [{ name: "A", key: 0 }, { name: "B", key: 1 }, { name: "C", key: 2 }, { name: "D", key: 3 }, { name: "E", key: 4 }],
    data: [["Id", "Time", "State", "Position", "Parts Amount (pcs)",  "Packaging"]],
    stock_data: [["Part number", "Parts in Stock"]],
    packages:[],
    positions_std:[]
    };
    constructor( props ){
    super( props );
    this.exportTransactionsToXLSFile = this.exportTransactionsToXLSFile.bind(this);
    this.exportTransactionsToJSONFile = this.exportTransactionsToJSONFile.bind(this);
    this.exportTransactionsToCSVFile = this.exportTransactionsToCSVFile.bind(this);

    this.exportStockToXLSFile = this.exportStockToXLSFile.bind(this);
    this.exportStockToJSONFile = this.exportStockToJSONFile.bind(this);
    this.exportStockToCSVFile = this.exportStockToCSVFile.bind(this);
  }

  componentDidMount(){
    if(!sessionStorage.getItem("user_token")){
        this.setState({redirect:true});
      }
    this.getLogs();

  }

  getPackages(){
    if(sessionStorage.getItem('user_token')){
        GetData('packaging', sessionStorage.getItem('user_token')).then((result) => {
          let responseJSON = result;
          if(responseJSON){
            let packages = [];
            let parts = this.state.stock_data;
            this.state.positions_std.forEach(position => {
              let positionDescription = position.position_description;
              let positionId = position._id;
              let partsCount = 0;
              responseJSON.forEach(item => {
              if(positionId === item.package_position_id){
                if(item.package_state === "Confirmed"){
                  partsCount += parseInt(item.parts_amount);
                }
              }
            });
            packages.push({part_number: positionDescription, parts_stock: partsCount});
            parts.push([positionDescription, partsCount]);
            });
            this.setState({packages: packages}, () => {
              this.setState({stock_data: parts}, () => {
                this.render();
              });
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
              this.getPackages();
          });
          }else{
          this.getPackages();
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
            let logs=[];
            let datas = this.state.data;
            responseJSON.forEach(item => {
              let date = new Date(item.timestamp * 1000);
              let formattedDate = ('0' + date.getDate()).slice(-2) + '. ' + ('0' + (date.getMonth() + 1)).slice(-2) + '. ' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
              let log=[formattedDate, item.position_state, item.position_name,  item.parts_amount,  item.package_name];
              let data=[item._id, formattedDate, item.position_state, item.position_name,  item.parts_amount,  item.package_name];
              logs.push(log);
              datas.push(data);
            });
            this.setState({logs: logs}, () => {
              this.setState({data: datas}, () => {
                this.getPositions();
              });
            });
          });
          }else{
          this.getPositions();
        }
        });
      }
    }

    exportTransactionsToXLSFile() {
        let data = this.state.data;
    		/* convert state to workbook */
    		const ws = XLSX.utils.aoa_to_sheet(data);
    		const wb = XLSX.utils.book_new();
    		XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    		/* generate XLSX file and send to client */
    		XLSX.writeFile(wb, "transaction_logs.xlsx");
    	};

      exportStockToXLSFile() {
          let data = this.state.stock_data;
      		/* convert state to workbook */
      		const ws = XLSX.utils.aoa_to_sheet(data);
      		const wb = XLSX.utils.book_new();
      		XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      		/* generate XLSX file and send to client */
      		XLSX.writeFile(wb, "stock_level.xlsx");
      	};

    exportTransactionsToJSONFile() {
      let filename = "transaction_logs.json";
      let contentType = "application/json;charset=utf-8;";
      let data = {transactions: this.state.logs_std};
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    exportStockToJSONFile() {
      let filename = "stock_level.json";
      let contentType = "application/json;charset=utf-8;";
      let data = {stock_level: this.state.packages};
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };

    exportTransactionsToCSVFile() {
      let csvContent = "data:text/csv;charset=utf-8,";
      this.state.data.forEach(function(rowArray) {
          let row = rowArray.join(",");
          csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transaction_logs.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    };

    exportStockToCSVFile() {
      let csvContent = "data:text/csv;charset=utf-8,";
      this.state.stock_data.forEach(function(rowArray) {
          let row = rowArray.join(",");
          csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "stock_level.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    };

render(){
  if(this.state.redirect){
    return(<Redirect to={'/'}/>);
  }
  const { classes } = this.props;
  return (
    <GridContainer>
    <GridItem xs={12} sm={12} md={6}>
      <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>Export transactions (last 24 hours)</h4>
          <p className={classes.cardCategoryWhite}>
          </p>
        </CardHeader>
        <CardBody>
        <Button variant="outlined" color="warning" size="sm" value="json_transactions" onClick = {this.exportTransactionsToJSONFile}>JSON</Button>
        <Button variant="outlined" color="warning" size="sm" value="xlsx_transactions" onClick = {this.exportTransactionsToXLSFile}>.xlsx</Button>
        <Button variant="outlined" color="warning" size="sm" value="csv_transactions" onClick = {this.exportTransactionsToCSVFile}>.csv</Button>
        </CardBody>
      </Card>
    </GridItem>

    <GridItem xs={12} sm={12} md={6}>
      <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>Export current stock levels</h4>
          <p className={classes.cardCategoryWhite}>
          </p>
        </CardHeader>
        <CardBody>
        <Button variant="outlined" color="warning" size="sm" value="json_stock" onClick = {this.exportStockToJSONFile}>JSON</Button>
        <Button variant="outlined" color="warning" size="sm" value="xlsx_stocks" onClick = {this.exportStockToXLSFile}>.xlsx</Button>
        <Button variant="outlined" color="warning" size="sm" value="csv_stocks" onClick = {this.exportStockToCSVFile}>.csv</Button>
        </CardBody>
      </Card>
    </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="success">
            <h4 className={classes.cardTitleWhite}>All Transactions</h4>
            <p className={classes.cardCategoryWhite}>
              List of all transactions, made by RFID readers, in the last 24 hours
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="black"
              tableHead={["Time", "State", "Position", "Parts Amount (pcs)",  "Packaging"]}
              tableData={this.state.logs}
            />
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}
}

export default withStyles(styles)(TableList);
