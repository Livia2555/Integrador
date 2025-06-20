import { useState, useEffect } from "react";
import "./Historico.css";
import editaricon from "../assets/editaricon.png";
import Trash from "../assets/Trash.png";


// Converte "dd/mm/yyyy, HH:MM:SS" → Date
function parseDateTimeBR(str) {
  const [datePart, timePart] = str.split(", ");
  if (!datePart || !timePart) return null;
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

// Converte "yyyy-mm-ddTHH:MM" → "dd/mm/yyyy, HH:MM:SS"
function formatDateToBR(datetimeLocal) {
  const dt = new Date(datetimeLocal);
  if (isNaN(dt)) return "";
  const day = dt.getDate().toString().padStart(2, "0");
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const year = dt.getFullYear();
  const hours = dt.getHours().toString().padStart(2, "0");
  const minutes = dt.getMinutes().toString().padStart(2, "0");
  const seconds = dt.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

// Converte "dd/mm/yyyy, HH:MM:SS" → "yyyy-mm-ddTHH:MM"
function parseDateBRToISO(str) {
  const [datePart, timePart] = str.split(", ");
  if (!datePart || !timePart) return "";
  const [day, month, year] = datePart.split("/");
  const [hour, minute] = timePart.split(":");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T${hour}:${minute}`;
}

export function Historico() {
  const [historicos, setHistoricos] = useState([]);
  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
  const [idExcluir, setIdExcluir] = useState(null);
  const [filtroId, setFiltroId] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const token = localStorage.getItem("access_token");

  const [formulario, setFormulario] = useState({
    id: null,
    sensor: "",
    ambiente: "",
    valor: "",
    timestamp: "",
  });

  useEffect(() => {
    if (!token) return;

    let url = "http://localhost:8000/historico/";

    if (filtroId) {
      // Busca por ID específico
      url += filtroId;
    } else if (filtroData) {
      url += `?data=${filtroData}`;
    }

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) {
          // Se ID não encontrado, retornar array vazio para não quebrar o mapa
          if (res.status === 404) return [];
          throw new Error("Erro na requisição");
        }
        // Quando busca por ID, a API provavelmente retorna um objeto e não array
        // Então convertemos para array pra map funcionar no render
        const data = await res.json();
        return filtroId ? [data] : data.results || data;
      })
      .then((data) => setHistoricos(data))
      .catch(() => setHistoricos([]));
  }, [token, filtroId, filtroData]);

  const atualizarFormulario = (e) =>
    setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const abrirModalEditar = (h) => {
    setFormulario({
      id: h.id,
      sensor: h.sensor,
      ambiente: h.ambiente,
      valor: h.valor,
      timestamp: parseDateBRToISO(h.timestamp),
    });
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdExcluir(id);
    setExibirModalExcluir(true);
  };

  const limparFormulario = () =>
    setFormulario({
      id: null,
      sensor: "",
      ambiente: "",
      valor: "",
      timestamp: "",
    });

  const enviarFormulario = async (e) => {
    e.preventDefault();
    const corpo = {
      sensor: formulario.sensor,
      ambiente: formulario.ambiente,
      valor: parseFloat(formulario.valor),
      timestamp: formatDateToBR(formulario.timestamp),
    };
    const url = formulario.id
      ? `http://localhost:8000/historico/${formulario.id}/`
      : "http://localhost:8000/historico/";
    const metodo = formulario.id ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });
      if (!res.ok) throw await res.json();
      const data = await res.json();
      if (formulario.id) {
        setHistoricos((prev) => prev.map((x) => (x.id === data.id ? data : x)));
        setExibirModalEditar(false);
      } else {
        setHistoricos((prev) => [...prev, data]);
        setExibirModalCriar(false);
      }
      limparFormulario();
    } catch (err) {
      alert("Erro ao salvar histórico: " + JSON.stringify(err));
    }
  };

  const confirmarExclusao = async () => {
    try {
      const res = await fetch(`http://localhost:8000/historico/${idExcluir}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setHistoricos((prev) => prev.filter((h) => h.id !== idExcluir));
      setExibirModalExcluir(false);
    } catch {
      alert("Erro ao excluir histórico");
    }
  };

  const handleDownload = () => {
    fetch("http://localhost:8000/historico/exportarHistorico/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "historico.xlsx";
        a.click();
      })
      .catch(() => alert("Erro ao exportar histórico"));
  };

  return (
    <main className="container-historico">
      <h1 className="tituloHis">Gerenciamento de Histórico</h1>

      <div className="actions-row">
        <input
          type="text"
          placeholder="Filtrar por ID"
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          disabled={filtroData !== ""}
        />
        <input
          type="text"
          placeholder="Filtrar por data (DD/MM/YYYY)"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          disabled={filtroId !== ""}
        />

        {token && (
          <>
            <button
              className="botao-criar"
              onClick={() => {
                limparFormulario();
                setExibirModalCriar(true);
              }}
            >
              Novo Histórico
            </button>
            <button className="botao-download" onClick={handleDownload}>
              Exportar Histórico
            </button>
          </>
        )}
      </div>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? "Adicionar" : "Editar"} Histórico</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <div className="form-group">
                <label htmlFor="sensor">Sensor ID</label>
                <input
                  id="sensor"
                  name="sensor"
                  value={formulario.sensor}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ambiente">Ambiente ID</label>
                <input
                  id="ambiente"
                  name="ambiente"
                  value={formulario.ambiente}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="valor">Valor</label>
                <input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  value={formulario.valor}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="timestamp">Data e Hora</label>
                <input
                  id="timestamp"
                  name="timestamp"
                  type="datetime-local"
                  value={formulario.timestamp}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
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
            <p>Deseja realmente excluir este histórico?</p>
            <footer className="botoes">
              <button onClick={confirmarExclusao} className='btsim'>Excluir</button>
              <button onClick={() => setExibirModalExcluir(false)} className='btnao' >Cancelar</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaHistorico">
          <thead>
            <tr className="linhaCabecalhoHistorico">
              <th>ID</th>
              <th>Sensor</th>
              <th>Ambiente</th>
              <th>Valor</th>
              <th>Timestamp</th>
              {token && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {historicos.map((h) => (
              <tr key={h.id} className="linhaHistorico">
                <td>{h.id}</td>
                <td>{h.sensor}</td>
                <td>{h.ambiente}</td>
                <td>{h.valor}</td>
                <td>
                  {parseDateTimeBR(h.timestamp)?.toLocaleString() ||
                    h.timestamp}
                </td>
                {token && (
                  <td>
                    <button
                      className="btnEditar"
                      onClick={() => abrirModalEditar(h)}
                    >
                        <img src={editaricon} alt='icone de edição'></img>
                      
                    </button>
                    <button
                      className="btnExcluir"
                      onClick={() => abrirModalExcluir(h.id)}
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
