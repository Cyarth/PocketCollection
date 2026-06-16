import type { Card } from "../types/card";

interface Props {
  cards: Card[];
}

function CardGrid({ cards }: Props) {
  if (cards.length === 0) {
    return <p className="empty">Escribe al menos 3 letras para buscar cartas.</p>;
  }

  return (
    <section className="card-grid">
      {cards.map((card) => (
        <article className="pokemon-card" key={card.tcgdex_id}>
          <img
            src={`${card.imagen_url}/high.webp`}
            alt={card.nombre_en}
            className="pokemon-card-img"
          />

          <div className="pokemon-card-body">
            <h3>{card.nombre_en}</h3>
            <p>{card.set_nombre}</p>
            <span>{card.rareza || "Sin rareza"}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default CardGrid;