import { useState, useEffect } from "react";
import "./Sensor.css";
import editaricon from "../assets/editaricon.png";
import Trash from "../assets/Trash.png";

export function Sensor() {
  const [sensores, setSensores] = useState([]);
  const [tiposSensor, setTiposSensor] = useState([]);
  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
  const [idSensorExcluir, setIdSensorExcluir] = useState(null);
  const [filtroSensor, setFiltroSensor] = useState("");
  const token = localStorage.getItem("access_token");

  const unidadesMedida = ["°C", "%", "uni", "lux"];
  const statusOpcoes = ["ativo", "inativo"];

  const [formulario, setFormulario] = useState({
    id: null,
    sensor: "",
    mac_address: "",
    unidade_medida: "",
    latitude: "",
    longitude: "",
    status: "",
  });

  // Busca TODOS os sensores (sem filtro na API)
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/sensores/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const listaSensores = data.results || data;
        setSensores(listaSensores);

        // Pega os tipos únicos para filtro e dropdown
        const tipos = [...new Set(listaSensores.map((s) => s.sensor))];
        setTiposSensor(tipos);
      })
      .catch(() => {
        setSensores([]);
        setTiposSensor([]);
      });
  }, [token]);

  // Atualiza campos do formulário
  const atualizarFormulario = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Abre modal edição com dados preenchidos
  const abrirModalEditar = (sensor) => {
    setFormulario({
      ...sensor,
      latitude: sensor.latitude.toString(),
      longitude: sensor.longitude.toString(),
      status: sensor.status.toLowerCase(),
    });
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdSensorExcluir(id);
    setExibirModalExcluir(true);
  };

  const limparFormulario = () => {
    setFormulario({
      id: null,
      sensor: "",
      mac_address: "",
      unidade_medida: "",
      latitude: "",
      longitude: "",
      status: "",
    });
  };

  // Salvar sensor (POST ou PUT)
  const enviarFormulario = async (e) => {
    e.preventDefault();

    const corpo = {
      sensor: formulario.sensor.toLowerCase(),
      mac_address: formulario.mac_address,
      unidade_medida: formulario.unidade_medida,
      latitude: parseFloat(formulario.latitude),
      longitude: parseFloat(formulario.longitude),
      status: formulario.status.toLowerCase(),
    };

    const url = formulario.id
      ? `http://localhost:8000/sensores/${formulario.id}/`
      : "http://localhost:8000/sensores/";

    const metodo = formulario.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });

      if (response.ok) {
        const data = await response.json();

        if (formulario.id) {
          // Atualiza sensor na lista local, substituindo antigo
          setSensores((prev) =>
            prev.map((s) => (s.id === data.id ? data : s))
          );
          setExibirModalEditar(false);
          alert("Sensor atualizado!");
        } else {
          // Adiciona sensor novo
          setSensores((prev) => [...prev, data]);
          setExibirModalCriar(false);
          alert("Sensor criado!");
        }

        // Atualiza tipos (caso novo sensor tenha tipo novo)
        setTiposSensor((prev) => {
          if (!prev.includes(data.sensor)) {
            return [...prev, data.sensor];
          }
          return prev;
        });

        limparFormulario();
      } else {
        const erro = await response.json();
        alert("Erro ao salvar sensor: " + JSON.stringify(erro));
      }
    } catch (error) {
      alert("Erro ao salvar sensor: " + error.message);
    }
  };

  // Confirmar exclusão
  const confirmarExclusao = async () => {
    try {
      const response = await fetch(`http://localhost:8000/sensores/${idSensorExcluir}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        setSensores((prev) => prev.filter((s) => s.id !== idSensorExcluir));
        setExibirModalExcluir(false);
        alert("Sensor excluído!");
      } else {
        alert("Erro ao excluir sensor");
      }
    } catch {
      alert("Erro ao excluir sensor");
    }
  };

  // Aplica filtro localmente na lista completa
  const sensoresFiltrados = filtroSensor
    ? sensores.filter((s) => s.sensor === filtroSensor)
    : sensores;

  // Função para download dos sensores
  const handleDownload = () => {
    fetch("http://localhost:8000/sensores/exportarSensores/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sensores.xlsx"; // nome do arquivo
        link.click();
      })
      .catch(() => alert("Erro ao exportar os sensores"));
  };

  return (
    <main className="container-sensores">
      <h1>Gerenciamento de Sensores</h1>

      <div className="actions-row">
        <select
          className="filtro"
          value={filtroSensor}
          onChange={(e) => setFiltroSensor(e.target.value)}
        >
          <option value="">Filtrar por Sensor</option>
          {tiposSensor.map((tipo, i) => (
            <option key={i} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>

        {token && (
          <>
            {/* Botão para adicionar novo sensor */}
            <button
              onClick={() => {
                limparFormulario();
                setExibirModalCriar(true);
              }}
              className="botao-criar"
            >
              Novo Sensor
            </button>

            {/* Botão para exportar os sensores */}
            <button onClick={handleDownload} className="botao-download">
              Exportar Sensores
            </button>
          </>
        )}
      </div>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? "Adicionar Novo" : "Editar"} Sensor</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <select
                name="sensor"
                value={formulario.sensor}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Selecione o tipo de sensor</option>
                {tiposSensor.map((tipo, i) => (
                  <option key={i} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
              <input
                name="mac_address"
                placeholder="MAC Address"
                value={formulario.mac_address}
                onChange={atualizarFormulario}
                required
              />
              <select
                name="unidade_medida"
                value={formulario.unidade_medida}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Unidade de Medida</option>
                {unidadesMedida.map((u, i) => (
                  <option key={i} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                name="latitude"
                placeholder="Latitude"
                value={formulario.latitude}
                onChange={atualizarFormulario}
                required
              />
              <input
                name="longitude"
                placeholder="Longitude"
                value={formulario.longitude}
                onChange={atualizarFormulario}
                required
              />
              <select
                name="status"
                value={formulario.status}
                onChange={atualizarFormulario}
                required
              >
                <option value="">Status</option>
                {statusOpcoes.map((s, i) => (
                  <option key={i} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <footer className="botoes">
                <button type="submit" className="btsim">Salvar</button>
                <button
                  className="btnao"
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
              <button onClick={confirmarExclusao} className='btsim'>Excluir</button>
              <button onClick={() => setExibirModalExcluir(false)} className='btnao' >Cancelar</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaSensores">
          <thead>
            <tr className="linhaSensorCabecalho">
              <th>Sensor</th>
              <th>MAC Address</th>
              <th>Unidade</th>
              <th>Latitude</th>
              <th>Longitude</th>
              {token && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {sensoresFiltrados.map((sensor) => (
              <tr key={sensor.id} className="linhaSensor">
                <td>{sensor.sensor}</td>
                <td>{sensor.mac_address}</td>
                <td>{sensor.unidade_medida}</td>
                <td>{sensor.latitude}</td>
                <td>{sensor.longitude}</td>
                {token && (
                  <td>
                    <button
                      className="btnEditarSensor"
                      onClick={() => abrirModalEditar(sensor)}
                    >
                      <img src={editaricon} alt='icone de edição'></img>
                    </button>
                    <button
                      className="btnExcluirSensor"
                      onClick={() => abrirModalExcluir(sensor.id)}
                    >
                      <img src={Trash} alt='icone de lixeira'></img>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
