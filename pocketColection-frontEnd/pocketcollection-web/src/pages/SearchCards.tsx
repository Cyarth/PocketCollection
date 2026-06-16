import { useEffect, useState } from "react";
import { searchCards } from "../api/card.api";
import type { Card } from "../types/card";
import CardGrid from "../components/CardGrid";

function SearchCards() {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (search.trim().length < 3) {
        setCards([]);
        return;
      }

      try {
        setLoading(true);
        const result = await searchCards(search);
        setCards(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [search]);

  return (
    <main className="page">
      <section className="hero">
        <h1>PocketCollection</h1>
        <p>Busca cartas Pokémon TCG en tu catálogo local.</p>

        <input
          className="search-input"
          type="text"
          placeholder="Ej: Charizard, Pikachu, Dragapult..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p className="loading">Buscando...</p>}
      </section>

      <CardGrid cards={cards} />
    </main>
  );
}

export default SearchCards;