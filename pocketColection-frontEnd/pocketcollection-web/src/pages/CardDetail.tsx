import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCardById } from "../api/card.api";
import { addCardToCollection, getCollections } from "../api/collection.api";

export default function CardDetail() {
  const { id } = useParams();

  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("Near Mint");
  const [language, setLanguage] = useState("English");
  const [isFoil, setIsFoil] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      try {
        if (!id) return;

        const result = await getCardById(id);
        setCard(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id]);

  const openAddModal = async () => {
    const data = await getCollections();
    setCollections(data);

    if (data.length > 0) {
      setSelectedCollectionId(String(data[0].id));
    }

    setShowAddModal(true);
  };

  const handleAddToCollection = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCollectionId || !card) return;

    await addCardToCollection(Number(selectedCollectionId), {
      card_id: card.tcgdex_id,
      quantity,
      condition,
      language,
      is_foil: isFoil,
    });

    setShowAddModal(false);
    alert("Carta agregada a la colección");
  };

  if (loading) {
    return <p className="loading">Cargando carta...</p>;
  }

  if (!card) {
    return <p className="loading">Carta no encontrada.</p>;
  }

  return (
    <main className="card-detail-page">
      <section className="card-detail-layout">
        <div className="card-detail-image-panel">
          <img src={`${card.imagen_url}/high.webp`} alt={card.nombre_en} />
        </div>

        <div className="card-detail-content">
          <div className="breadcrumb">
            Pokémon Cards › {card.nombre_es || card.nombre_en}
          </div>

          <h1>{card.nombre_es || card.nombre_en}</h1>

          <p className="card-subtitle">
            {card.categoria} · {card.rareza}
          </p>

          <div className="detail-grid">
            <p>
              <strong>Número:</strong> {card.numero}
            </p>
            <p>
              <strong>HP:</strong> {card.hp}
            </p>
            <p>
              <strong>Etapa:</strong> {card.etapa}
            </p>
            <p>
              <strong>Regulación:</strong> {card.regulacion}
            </p>
            <p>
              <strong>Ilustrador:</strong> {card.ilustrador}
            </p>
          </div>

          <section className="price-section">
            <h2>Comparación de precios</h2>

            <div className="price-cards">
              <article className="price-card">
                <span>TCGPlayer</span>
                <strong>$1.11</strong>
                <small>Near Mint · Último precio</small>
              </article>

              <article className="price-card">
                <span>TCGMatch</span>
                <strong>$1.25</strong>
                <small>Precio estimado</small>
              </article>
            </div>
          </section>
        </div>

        <aside className="collection-box">
          <span>Agregar carta</span>
          <h3>Añadir a mi colección</h3>
          <p>Guarda esta carta en una de tus colecciones personales.</p>

          <button className="add-button" onClick={openAddModal}>
            Añadir a colección
          </button>
        </aside>
      </section>

      {showAddModal && (
        <div className="modal-overlay">
          <section className="modal-card">
            <h2>Añadir carta</h2>
            <p>{card.nombre_es || card.nombre_en}</p>

            <form onSubmit={handleAddToCollection}>
              <label>
                Colección
                <select
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                  required
                >
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>

              <label>
                Condición
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option>Near Mint</option>
                  <option>Lightly Played</option>
                  <option>Moderately Played</option>
                  <option>Heavily Played</option>
                  <option>Damaged</option>
                </select>
              </label>

              <label>
                Idioma
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Japanese</option>
                </select>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={isFoil}
                  onChange={(e) => setIsFoil(e.target.checked)}
                />
                Foil / Holo
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="new-collection-btn">
                  Agregar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}