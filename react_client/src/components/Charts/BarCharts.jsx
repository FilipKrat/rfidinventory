import React from 'react';
import './Charts.css';
import Chart from "chart.js";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.positions;
    this.myChart.data.datasets[2].data = this.props.removed;
    this.myChart.data.datasets[1].data = this.props.confirmed;
    this.myChart.data.datasets[0].data = this.props.unconfirmed;
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          }
      },
      data: {
        labels: this.props.positions,
        datasets: [
        {
          label: 'Unconfirmed',
          data: this.props.unconfirmed,
          backgroundColor: '#e9ecef'
        },{
          label: 'Confirmed',
          data: this.props.confirmed,
          backgroundColor: '#015BAB'
        },{
          label: 'Currently removed (2 mins)',
          data: this.props.removed,
          backgroundColor: '#E51F22'
        }]
      }
    });
  }

  render() {
    return (
      <div class="card-body">
        <h5 class="card-title">Rollo-SUP7</h5>
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

export default BarChart;
