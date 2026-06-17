import { useEffect, useState } from "react";
import { createCollection, getCollections } from "../api/collection.api";
import { useNavigate } from "react-router-dom";

interface Collection {
  id: number;
  name: string;
  description: string;
  total_cards: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const loadCollections = async () => {
    const data = await getCollections();
    setCollections(data);
  };

  useEffect(() => {
    loadCollections().finally(() => setLoading(false));
  }, []);

  const handleCreateCollection = async (event: React.FormEvent) => {
    event.preventDefault();

    await createCollection(name, description);

    setName("");
    setDescription("");
    setShowModal(false);

    await loadCollections();
  };

  if (loading) {
    return <main className="collections-page">Cargando colecciones...</main>;
  }

  return (
    <main className="collections-page">
      <div className="collections-header">
        <h1>Mis colecciones</h1>

        <button
          className="new-collection-btn"
          onClick={() => setShowModal(true)}
        >
          + Nueva colección
        </button>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <article
            key={collection.id}
            className="collection-card"
            onClick={() => navigate(`/collections/${collection.id}`)}
          >
            <div className="collection-card-top">
              <h3>{collection.name}</h3>
              <span className="collection-badge">
                {collection.total_cards} cartas
              </span>
            </div>

            <p>{collection.description}</p>

            <div className="collection-footer">
              <span>💰 Valor estimado</span>
              <strong>Próximamente</strong>
            </div>
          </article>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <section className="modal-card">
            <h2>Nueva colección</h2>
            <p>Crea una carpeta para organizar tus cartas.</p>

            <form onSubmit={handleCreateCollection}>
              <input
                type="text"
                placeholder="Nombre de colección"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="new-collection-btn">
                  Crear colección
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
