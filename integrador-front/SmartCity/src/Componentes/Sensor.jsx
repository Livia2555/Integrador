import { useState, useEffect } from "react";
import "./Sensor.css";

export function Sensor() {
  const [sensores, setSensores] = useState([]);
  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
  const [idSensorExcluir, setIdSensorExcluir] = useState(null);

  const [formularioSensor, setFormularioSensor] = useState({
    id: null,
    nome: "",
    mac_address: "",
    unidade_medida: "",
    latitude: "",
    longitude: "",
  });

  const [unidadeFiltro, setUnidadeFiltro] = useState("");
  const token = localStorage.getItem("access_token");

  const unidadesPermitidas = ["°C", "Contador", "Umidade", "Luminosidade"];

  useEffect(() => {
    fetch("http://localhost:8000/sensores/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSensores(data.results || data));
  }, [token]);

  const sensoresFiltrados = unidadeFiltro
    ? sensores.filter((s) => s.unidade_medida === unidadeFiltro)
    : sensores;

  const atualizarFormulario = (e) => {
    setFormularioSensor({
      ...formularioSensor,
      [e.target.name]: e.target.value,
    });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (!unidadesPermitidas.includes(formularioSensor.unidade_medida)) {
      alert("Unidade de medida inválida!");
      return;
    }

    const url = formularioSensor.id
      ? `http://localhost:8000/sensores/${formularioSensor.id}/`
      : "http://localhost:8000/sensores/";
    const metodo = formularioSensor.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formularioSensor),
    });

    if (response.ok) {
      const data = await response.json();
      if (formularioSensor.id) {
        setSensores((prev) => prev.map((s) => (s.id === data.id ? data : s)));
        setExibirModalEditar(false);
        alert("Sensor atualizado!");
      } else {
        setSensores((prev) => [...prev, data]);
        setExibirModalCriar(false);
        alert("Sensor criado!");
      }
      limparFormulario();
    } else {
      alert("Erro ao salvar sensor");
    }
  };

  const limparFormulario = () => {
    setFormularioSensor({
      id: null,
      nome: "",
      mac_address: "",
      unidade_medida: "",
      latitude: "",
      longitude: "",
    });
  };

  const abrirModalEditar = (sensor) => {
    setFormularioSensor(sensor);
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdSensorExcluir(id);
    setExibirModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    const response = await fetch(
      `http://localhost:8000/sensores/${idSensorExcluir}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok || response.status === 204) {
      setSensores((prev) => prev.filter((s) => s.id !== idSensorExcluir));
      setExibirModalExcluir(false);
      alert("Sensor excluído!");
    } else {
      alert("Erro ao excluir sensor");
    }
  };

  return (
    <main className="container-sensores">
      <header>
        <h1>Gerenciamento de Sensores</h1>
        <button
          onClick={() => {
            limparFormulario();
            setExibirModalCriar(true);
          }}
          className="botao-criar"
        >
          Novo Sensor
        </button>
        <select
          className="filtro"
          value={unidadeFiltro}
          onChange={(e) => setUnidadeFiltro(e.target.value)}
        >
          <option value="">Unidade de Medida</option>
          {unidadesPermitidas.map((u, index) => (
            <option key={index} value={u}>
              {u}
            </option>
          ))}
        </select>
      </header>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? "Adicionar Novo " : "Editar"} Sensor</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <input
                name="nome"
                placeholder="Nome do sensor"
                value={formularioSensor.nome}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="mac_address"
                placeholder="Mac Address"
                value={formularioSensor.mac_address}
                onChange={atualizarFormulario}
                required
              />
              <select
                name="unidade_medida"
                value={formularioSensor.unidade_medida}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Selecione a unidade</option>
                {unidadesPermitidas.map((u, index) => (
                  <option key={index} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                name="latitude"
                placeholder="Latitude"
                value={formularioSensor.latitude}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="longitude"
                placeholder="Longitude"
                value={formularioSensor.longitude}
                onChange={atualizarFormulario}
                required
              />
              <footer className="botoes">
                <button type="submit">Salvar</button>
                <button
                  type="button"
                  onClick={() =>
                    exibirModalCriar
                      ? setExibirModalCriar(false)
                      : setExibirModalEditar(false)
                  }
                >
                  Cancelar
                </button>
              </footer>
            </form>
          </article>
        </section>
      )}

      {exibirModalExcluir && (
        <section className="modal-overlay">
          <article className="modal modal-pequeno">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este sensor?</p>
            <footer className="botoes">
              <button onClick={confirmarExclusao}>Sim</button>
              <button onClick={() => setExibirModalExcluir(false)}>Não</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaSensores">
          <thead>
            <tr className="linhaSensorCabecalho">
              <th>Sensor</th>
              <th>mac_address</th>
              <th>Unidade de Medida</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {sensoresFiltrados.map((sensor) => (
              <tr key={sensor.id} className="linhaSensor">
                <td>{sensor.nome}</td>
                <td>{sensor.mac_address}</td>
                <td>{sensor.unidade_medida}</td>
                <td>{sensor.latitude}</td>
                <td>{sensor.longitude}</td>
                <td>
                  <button
                    className="btnEditarSensor"
                    onClick={() => abrirModalEditar(sensor)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btnExcluirSensor"
                    onClick={() => abrirModalExcluir(sensor.id)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
