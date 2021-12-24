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
    const arrData = data;
    let departamentos = [];
    let arrFinal = [];
    //console.log(arrData);
    arrData.forEach(element => {
      if(departamentos.indexOf(element.location) === -1) {
        departamentos.push(element.location);
      }
    });
    //console.log(departamentos);
    departamentos.forEach(element => {
      let nuevo = {
        x: element,
        y: departamentos.filter((obj) => obj === element).length
      }
      arrFinal.push(nuevo);
    });
    //console.log(arrFinal);
    arrFinal.forEach(element => {
      element.y = (element.y * 100) / data.length;
      element.x = element.x + ": " + element.y.toFixed(2) + "%";
    });

    return arrFinal;

  };

  ordenarPorVacuna = (data) => {
    const arrData = data;
    let departamentos = [];
    let arrFinal = [];
    //console.log(arrData);
    arrData.forEach(element => {
      if(departamentos.indexOf(element.vaccine_type) === -1) {
        departamentos.push(element.vaccine_type);
      }
    });
    //console.log(departamentos);
    departamentos.forEach(element => {
      let nuevo = {
        x: element,
        y: departamentos.filter((obj) => obj === element).length
      }
      arrFinal.push(nuevo);
    });
    //console.log(arrFinal);
    arrFinal.forEach(element => {
      element.y = (element.y * 100) / data.length;
      element.x = element.x + ": " + element.y.toFixed(2) + "%";
    });

    return arrFinal;
  };

  ordenarPorEdad = (data) => {
    const arrData = data;
    let edades = [
      {
        x: "menores",
        y: arrData.filter((obj) => obj.age < 18).length
      },
      {
        x: "<25",
        y: arrData.filter((obj) => obj.age >= 18 && obj.age < 25).length
      },
      {
        x: "<35",
        y: arrData.filter((obj) => obj.age >= 25 && obj.age < 35).length
      },
      {
        x: "<45",
        y: arrData.filter((obj) => obj.age >= 18 && obj.age < 45).length
      },
      {
        x: "<55",
        y: arrData.filter((obj) => obj.age >= 18 && obj.age < 55).length
      },
      {
        x: "mayores",
        y: arrData.filter((obj) => obj.age >= 55).length
      }
    ]

    edades.forEach(element => {
      element.y = (element.y * 100) / data.length;
      element.x = element.x + ": " + element.y.toFixed(2) + "%";
    });

    return edades;
  }

  fetchData = async () => {
    try {
      let data = await api.getOneDose();

      data = data.data;
      //console.log(typeof(data.length));
      let result = this.ordenarPorDepartamento(data);

      let result2 = this.ordenarPorVacuna(data);

      let result3 = this.ordenarPorEdad(data);
      //console.log([result, result2, result3]);


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
