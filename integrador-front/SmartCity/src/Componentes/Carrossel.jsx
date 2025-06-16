import React, { useRef } from "react";
import "./Carrossel.css";
import primeiro from "../assets/primeiro.png";
import Sensores from "../assets/Sensores.png";
import Vector from "../assets/Vector.png";
import Seta from "../assets/Seta.png";
import Historicoo from "../assets/Historicoo.png";

export function Carrossel() {
  const listaRef = useRef(null);

  const handleSlider = (type) => {
    const lista = listaRef.current;
    if (!lista) return;

    const items = lista.querySelectorAll(".item");
    if (items.length === 0) return;

    if (type === "next") {
      lista.appendChild(items[0]);
    } else if (type === "prev") {
      lista.prepend(items[items.length - 1]);
    }
  };

  return (
    <section className="carrossel">
      <div className="lista" ref={listaRef}>
        <div className="item">
          <img src={primeiro} alt="imagem 1" />
          <div>
            <button>Ver mais</button>
          </div>
        </div>
        <div className="item">
          <img src={Sensores} alt="imagem 2" />
        </div>
        <div className="item">
          <img src={Historicoo} alt="imagem 3" />
        </div>
        <div className="item">
          <img src={primeiro} alt="imagem 4" />
        </div>
      </div>

      <div className="arrows">
        <button className="prev" onClick={() => handleSlider("prev")}>
          <img src={Vector} alt="voltar" />
        </button>
        <button className="next" onClick={() => handleSlider("next")}>
          <img src={Seta} alt="avançar" />
        </button>
      </div>
    </section>
  );
}
