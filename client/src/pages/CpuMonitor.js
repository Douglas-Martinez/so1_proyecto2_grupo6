import React, { Component } from 'react';
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis } from "victory";

import api from '../api';

export class CpuMonitor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
      chart_data: [],
      loading: true,
      error: null,
    }
  }

  fetchData = async () => {
    try {
      const data = await api.getCpu();

      //console.log(data.data);

      let d = new Date();

      let chartAxis = {
        x: d.getMinutes() + ":" + d.getSeconds(),
        y: data.data.percentage
      }

      this.setState({ chart_data: [...this.state.chart_data, chartAxis], percentage: data.data.percentage })
      //console.log(this.state.data);
      //console.log(this.state.chart_data);
    } catch (error) {
      this.setState({ error: error });
      console.error(error);
    }
  }

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 3500);
  }

  componentWillUnmount() {
    //limpiamos memoria
    clearTimeout(this.timeOutId);
    // paramos el intervalo
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div className="container">
        <h1>Monitor de CPU</h1>
        <hr /><br /><br />
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <VictoryChart
              theme={VictoryTheme.material}
            >
              <VictoryArea
                style={{ data: { fill: "#c43a31" } }}
                domain={{ y: [0, 100] }}
                data={this.state.chart_data}
              />
              <VictoryAxis
                label="Tiempo mm:ss"
                style={{
                  axisLabel: { padding: 30 },
                  tickLabels: { angle: 270 }
                }}
              />
              <VictoryAxis dependentAxis
                label="% CPU"
                style={{
                  axisLabel: { padding: 40 }
                }}
              />
            </VictoryChart>
          </div>
          <div className="col-12 col-md-6">
            <h3>Porcentaje utilizado: {this.state.percentage}%</h3>
          </div>
        </div>
      </div>
    )
  }
}

export default CpuMonitor