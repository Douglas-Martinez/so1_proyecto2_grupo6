import React, { Component } from "react";
import { VictoryChart, VictoryPie, VictoryLabel } from "victory";
import PageLoading from "../components/PageLoading";

import api from "../api";

export class OneDose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart_data: [],
      data: [],
      dpt: true,
      vac: false,
      age: false,
      loading: true,
      error: null,
      chart_dpt: [],
      chart_vac: [],
      chart_age: [],
    };
  }

  handleDpt = (change) => {
    //console.log(change);
    let result = [];
    if (change === 1) {
      //result = this.ordenarPorDepartamento(this.state.data);
      this.setState((prevState) => ({
        ...prevState,
        dpt: true,
        vac: false,
        age: false,
        chart_data: this.state.chart_dpt,
      }));
    } else if (change === 2) {
      //result = this.ordenarPorVacuna(this.state.data);
      this.setState((prevState) => ({
        ...prevState,
        dpt: false,
        vac: true,
        age: false,
        chart_data: this.state.chart_vac,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        dpt: false,
        vac: false,
        age: true,
        chart_data: this.state.chart_age,
      }));
    }

    //console.log(this.state);
  };

  componentDidUpdate() {
    //console.log(this.state);
  }

  ordenarPorDepartamento = (data) => {
    try {
      //console.log(data.length);
      let resultByDept = [];

      data.forEach((element) => {
        if (!this[element.location]) {
          this[element.location] = {
            x: element.location,
            y: 0,
          };
          resultByDept.push(this[element.location]);
        }
        this[element.location].y++;
      }, Object.create(null));
      //console.log(resultByDept.length);
      resultByDept.forEach((element) => {
        element.y = (element.y * 100) / data.length;
        element.x = element.x + ": " + element.y.toFixed(2) + "%";
      });
      //console.log(resultByDept.length);
      return resultByDept;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  ordenarPorVacuna = (data) => {
    try {
      //console.log(data.length);
      let resultByVac = [];

      data.forEach((element) => {
        if (!this[element.vaccine_type]) {
          this[element.vaccine_type] = {
            x: element.vaccine_type,
            y: 0,
          };
          resultByVac.push(this[element.vaccine_type]);
        }
        this[element.vaccine_type].y++;
      }, Object.create(null));
      //console.log(resultByVac.length);
      resultByVac.forEach((element) => {
        element.y = (element.y * 100) / data.length;
        element.x = element.x + ": " + element.y.toFixed(2) + "%";
      });
      //console.log(resultByVac.length);
      return resultByVac;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  fetchData = async () => {
    try {
      let data = await api.getOneDose();

      data = data.data;
      console.log(data);
      let result = this.ordenarPorDepartamento(data);
      let result2 = this.ordenarPorVacuna(data);
      let result3 = [];
      console.log([result, result2, result3]);


      if (this.state.vac === true) {
        //result = this.ordenarPorVacuna(data);
        this.setState({
          data: data,
          chart_data: result2,
          loading: false,
          chart_dpt: result,
          chart_vac: result2,
          chart_age: result3,
        });
      } else if (this.state.dpt === true) {
        ///result = this.ordenarPorDepartamento(data);
        this.setState({
          data: data,
          chart_data: result,
          loading: false,
          chart_dpt: result,
          chart_vac: result2,
          chart_age: result3,
        });
      } else {
        //result = [];
        this.setState({
          data: data,
          chart_data: result3,
          loading: false,
          chart_dpt: result,
          chart_vac: result2,
          chart_age: result3,
        });
      }
    } catch (error) {
      this.setState({ error: error });
      console.error(error);
    }
  };

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 10000);
  }

  componentWillUnmount() {
    //limpiamos memoria
    clearTimeout(this.timeOutId);
    // paramos el intervalo
    clearInterval(this.intervalId);
  }

  render() {
    if (this.state.loading === true) {
      return <PageLoading />;
    }
    return (
      <div className="container">
        <h1>Estadisticas con usuarios de una dosis</h1>
        <hr />
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => this.handleDpt(1)}
          >
            Departamento
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => this.handleDpt(2)}
          >
            Vacuna
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => this.handleDpt(3)}
          >
            Edad
          </button>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <svg viewBox="0 0 1000 800">
              <VictoryPie
                standalone={false}
                width={1000}
                height={800}
                padding={100}
                colorScale="qualitative"
                data={this.state.chart_data}
                style={{ labels: { fontSize: 20, fontWeight: "bold" } }}
              />
            </svg>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <ul className="list-group">
              {this.state.chart_data.map((item, index) => {
                return (
                  <li key={index} className="list-group-item">
                    {item.x}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default OneDose;
