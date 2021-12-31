import React, { Component } from "react";
import PageLoading from "../components/PageLoading";
import { VictoryChart, VictoryBar, VictoryTheme, VictoryLabel } from "victory";

import api from "../api";

export class InfoData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart_data: [],
      data: [],
      dataE: [],
      dataN: [],
      loading: true,
      error: null,
    };
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  ordenarPorDepartamento = (data) => {
    const arrData = data;
    let departamentos = [];
    let arrFinal = [];
    //console.log(arrData);
    arrData.forEach((element) => {
      if (departamentos.indexOf(element.location) === -1) {
        departamentos.push(element.location);
      }
    });
    //console.log(departamentos);
    departamentos.forEach((element) => {
      let nuevo = {
        x: element,
        y: data.filter((obj) => obj.location == element).length,
      };
      //console.log(nuevo);
      arrFinal.push(nuevo);
    });
    //console.log(arrFinal);
    arrFinal = arrFinal.sort((a, b) => (a.y < b.y ? 1 : -1));

    arrFinal = [arrFinal[0], arrFinal[1], arrFinal[2]];

    return arrFinal;
  };

  fetchData = async () => {
    try {
      let totalData = await api.getAllData();

      totalData = totalData.data.length;

      let data = await api.getTwoDose();

      let dataEdades = {
        ninos: await api.getNinos(),
        adolescentes: await api.getAdolescentes(),
        jovenes: await api.getJovenes(),
        adultos: await api.getAdultos(),
        viejos: await api.getVejez(),
      };

      let dataNombres = await api.getNombres();

      dataEdades = {
        ninos: dataEdades.ninos.data,
        adolescentes: dataEdades.adolescentes.data,
        jovenes: dataEdades.jovenes.data,
        adultos: dataEdades.adultos.data,
        viejos: dataEdades.viejos.data,
      };

      const barData = [
        {
          y: dataEdades.ninos,
          x: "niños",
        },
        {
          y: dataEdades.adolescentes,
          x: "adolescentes",
        },
        {
          y: dataEdades.jovenes,
          x: "jovenes",
        },
        {
          y: dataEdades.adultos,
          x: "adultos",
        },
        {
          y: dataEdades.viejos,
          x: "viejez",
        },
      ];

      data = data.data;

      data = this.ordenarPorDepartamento(data);
      
      this.setState({ data: data, loading: false, dataE: barData, dataN: dataNombres.data });
    } catch (error) {
      this.setState({ error: error });
      console.error(error);
    }
  };

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 3000);
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
        <h1>Areas con mayor vacunados</h1>
        <hr />
        <div className="row justify-content-center mt-2 mb-5">
          <div className="col-12 col-md-6">
            <ul className="list-group">
              {this.state.data.map((item, index) => {
                return (
                  <li key={index} className="list-group-item">
                    {item.x} {item.y}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <h1>Vacunados dosis completa por edades</h1>
        <hr />
        <div className="row justify-content-center mt-2 mb-5">
          <div className="col-12 col-md-6">
            <VictoryChart theme={VictoryTheme.material} domainPadding={5}>
              <VictoryBar
                barRatio={0.3}
                labels={({ datum }) => datum.y}
                data={this.state.dataE}
                style={{
                  
                  labels: { fill: "white" }
                }}
                labelComponent={<VictoryLabel dy={30}/>}
              />
            </VictoryChart>
          </div>
        </div>
        <h1>Últimas 5 personas vacunadas</h1>
        <hr />
        <div className="row justify-content-center mt-2 mb-5">
          <div className="col-12 col-md-6">
            <ul className="list-group">
              {this.state.dataN.map((item, index) => {
                return (
                  <li key={index} className="list-group-item">
                    {item}
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

export default InfoData;
