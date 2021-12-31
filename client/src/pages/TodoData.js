import React, { Component } from "react";
import PageLoading from "../components/PageLoading";

import api from "../api";

export class OneDose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chart_data: [],
      data: [],
    };
  }

  fetchData = async () => {
    try {
      let totalData = await api.getAllData();

      totalData = totalData.data;
      
      this.setState({ data: totalData, loading: false });
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
        <h1>Estadisticas de personas vacunadas</h1>
        <hr />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Departamento</th>
              <th scope="col">Vacuna</th>
              <th scope="col">No. Dosis</th>
            </tr>
          </thead>
          <tbody>
            {
                this.state.data.map((item, index) => {
                    return(<tr key={item._id}>
                        <th scope="row">{index}</th>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                        <td>{item.location}</td>
                        <td>{item.vaccine_type || item.vaccinetype}</td>
                        <td>{item.n_dose || item.dosis || 0}</td>
                    </tr>)
                })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default OneDose;
