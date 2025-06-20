import { useState, useEffect } from "react";
import "./Ambiente.css";
import editaricon from "../assets/editaricon.png";
import Trash from "../assets/Trash.png";

export function Ambiente() {
  const [ambientes, setAmbientes] = useState([]);
  const [exibirModalCriar, setExibirModalCriar] = useState(false);
  const [exibirModalEditar, setExibirModalEditar] = useState(false);
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
  const [idAmbienteExcluir, setIdAmbienteExcluir] = useState(null);
  const [filtroSig, setFiltroSig] = useState(""); // Para filtro por sig
  const token = localStorage.getItem("access_token");

  const [formulario, setFormulario] = useState({
    id: null,
    sig: "",
    descricao: "",
    ni: "",
    responsavel: "",
  });

  // Busca os ambientes, podendo filtrar por sig
  useEffect(() => {
    if (!token) return;

    let url = "http://localhost:8000/ambiente/";

    // Aplica filtro por sig
    if (filtroSig) {
      url = `${url}?sig=${filtroSig}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAmbientes(data.results || data);
      })
      .catch(() => {
        setAmbientes([]);
      });
  }, [token, filtroSig]);

  // Atualiza campos do formulário
  const atualizarFormulario = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Abre modal edição com dados preenchidos
  const abrirModalEditar = (ambiente) => {
    setFormulario(ambiente);
    setExibirModalEditar(true);
  };

  const abrirModalExcluir = (id) => {
    setIdAmbienteExcluir(id);
    setExibirModalExcluir(true);
  };

  const limparFormulario = () => {
    setFormulario({
      id: null,
      sig: "",
      descricao: "",
      ni: "",
      responsavel: "",
    });
  };

  // Salvar ambiente (POST ou PUT)
  const enviarFormulario = async (e) => {
    e.preventDefault();

    const corpo = {
      sig: formulario.sig,
      descricao: formulario.descricao,
      ni: formulario.ni,
      responsavel: formulario.responsavel,
    };

    const url = formulario.id
      ? `http://localhost:8000/ambiente/${formulario.id}/`
      : "http://localhost:8000/ambiente/";

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
          // Atualiza ambiente na lista local, substituindo o antigo
          setAmbientes((prev) =>
            prev.map((a) => (a.id === data.id ? data : a))
          );
          setExibirModalEditar(false);
          alert("Ambiente atualizado!");
        } else {
          // Adiciona ambiente novo
          setAmbientes((prev) => [...prev, data]);
          setExibirModalCriar(false);
          alert("Ambiente criado!");
        }

        limparFormulario();
      } else {
        const erro = await response.json();
        alert("Erro ao salvar ambiente: " + JSON.stringify(erro));
      }
    } catch (error) {
      alert("Erro ao salvar ambiente: " + error.message);
    }
  };

  // Confirmar exclusão
  const confirmarExclusao = async () => {
    try {
      const response = await fetch(`http://localhost:8000/ambiente/${idAmbienteExcluir}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        setAmbientes((prev) => prev.filter((a) => a.id !== idAmbienteExcluir));
        setExibirModalExcluir(false);
        alert("Ambiente excluído!");
      } else {
        alert("Erro ao excluir ambiente");
      }
    } catch {
      alert("Erro ao excluir ambiente");
    }
  };

  // Função para download dos ambientes
  const handleDownload = () => {
    fetch("http://localhost:8000/ambiente/exportarAmbiente/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ambientes.xlsx"; // nome do arquivo
        link.click();
      })
      .catch(() => alert("Erro ao exportar os ambientes"));
  };

  return (
    <main className="container-ambientes">
      <h1 className="tituloAmb">Gerenciamento de Ambientes</h1>

      <div className="actions-row">
        <input
          type="text"
          className="filtro-sig"
          value={filtroSig}
          onChange={(e) => setFiltroSig(e.target.value)}
          placeholder="Filtrar por SIG"
        />

        {token && (
          <>
            <button
              onClick={() => {
                limparFormulario();
                setExibirModalCriar(true);
              }}
              className="botao-criar"
            >
              Novo Ambiente
            </button>

            <button onClick={handleDownload} className="botao-download">
              Exportar Ambientes
            </button>
          </>
        )}
      </div>

      {(exibirModalCriar || exibirModalEditar) && (
        <section className="modal-overlay">
          <article className="modal modal-medio">
            <h2>{exibirModalCriar ? "Adicionar Novo" : "Editar"} Ambiente</h2>
            <form onSubmit={enviarFormulario} className="formulario">
              <div className="form-group">
                <label htmlFor="sig">SIG</label>
                <input
                  id="sig"
                  name="sig"
                  placeholder="SIG"
                  value={formulario.sig}
                  onChange={atualizarFormulario}
                  disabled={formulario.id}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <input
                  id="descricao"
                  name="descricao"
                  placeholder="Descrição"
                  value={formulario.descricao}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ni">NI</label>
                <input
                  id="ni"
                  name="ni"
                  placeholder="NI"
                  value={formulario.ni}
                  onChange={atualizarFormulario}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="responsavel">Responsável</label>
                <input
                  id="responsavel"
                  name="responsavel"
                  placeholder="Responsável"
                  value={formulario.responsavel}
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
            <p>Tem certeza que deseja excluir este ambiente?</p>
            <footer className="botoes">
              <button onClick={confirmarExclusao} className='btsim'>Excluir</button>
              <button onClick={() => setExibirModalExcluir(false)} className='btnao' >Cancelar</button>
            </footer>
          </article>
        </section>
      )}

      <section>
        <table className="tabelaAmbientes">
          <thead>
            <tr className="linhaAmbienteCabecalho">
              <th>SIG</th>
              <th>Descrição</th>
              <th>NI</th>
              <th>Responsável</th>
              {token && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {ambientes.map((ambiente) => (
              <tr key={ambiente.id} className="linhaAmbiente">
                <td>{ambiente.sig}</td>
                <td>{ambiente.descricao}</td>
                <td>{ambiente.ni}</td>
                <td>{ambiente.responsavel}</td>
                {token && (
                  <td>
                    <button
                      className="btnEditarAmbiente"
                      onClick={() => abrirModalEditar(ambiente)}
                    >
                      <img src={editaricon} alt='icone de edição'></img>
                    </button>
                    <button
                      className="btnExcluirAmbiente"
                      onClick={() => abrirModalExcluir(ambiente.id)}
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
