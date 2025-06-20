import React, { useRef } from "react";
import "./Carrossel.css";
import primeiro from "../assets/primeiro.png";
import Vector from "../assets/Vector.png";
import Seta from "../assets/Seta.png";
import Historico from "../assets/Historico.png";
import ImgSensores from "../assets/ImgSensores.png";
import Ambiente from "../assets/Ambiente.png";

export function Carrossel() {
  const listaRef = useRef(null);

  const handleSlider = (type) => {
    const lista = listaRef.current;
    if (!lista) return;

    const items = lista.querySelectorAll("article");
    if (items.length === 0) return;

    if (type === "next") {
      lista.appendChild(items[0]);
    } else if (type === "prev") {
      lista.prepend(items[items.length - 1]);
    }
  };

  return (
    <section
      className="carrossel"
      aria-label="Carrossel de imagens sobre a cidade inteligente"
    >
      <section
        className="lista"
        ref={listaRef}
        role="region"
        aria-roledescription="carrossel"
        aria-live="polite"
        tabIndex={0}
      >
        <article className="item">
          <img
            src={primeiro}
            alt="Vista da cidade com fundo azul representando uma cidade automatizada"
          />
        </article>

        <article className="item">
          <img
            src={ImgSensores}
            alt="Sensores inteligentes de iluminação, umidade, contador de pessoas e temperatura"
          />
        </article>

        <article className="item">
          <img
            src={Ambiente}
            alt="Ambiente com informações e responsáveis visíveis"
          />
        </article>

        <article className="item">
          <img
            src={Historico}
            alt="Histórico dos sensores de ambiente da cidade"
          />
        </article>

        
      </section>

      <aside className="arrows" aria-label="Controles do carrossel">
        <button
          className="prev"
          onClick={() => handleSlider("prev")}
          aria-label="Imagem anterior"
        >
          <img src={Vector} alt="" aria-hidden="true" />
        </button>
        <button
          className="next"
          onClick={() => handleSlider("next")}
          aria-label="Próxima imagem"
        >
          <img src={Seta} alt="" aria-hidden="true" />
        </button>
      </aside>
    </section>
  );
}
