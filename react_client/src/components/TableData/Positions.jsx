import React, {Component} from 'react';
import Button from "components/CustomButtons/Button.jsx";

class Positions extends Component {

  constructor(props){
    super(props);
  }

  render() {
    if(this.props.positionsData){
    let positions = this
      .props
      .positionsData
      .map(function (positions, index) {
        return (
          <div>
          [positions._id, positions.position_name,positions.position_description, <Button variant="outlined" color="info" size="sm" value={positions._id} onClick={this.props.editPosition}>Edit</Button>, <Button variant="outlined" color="warning" size="sm">Remove</Button>]
        </div>)
      }, this);
  }else{
    return ("");
  }
 }
}

export default Positions;
