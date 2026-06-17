import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCollectionById } from "../api/collection.api";

export default function CollectionDetail() {
  const { id } = useParams();

  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const data = await getCollectionById(Number(id));
        setCollection(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [id]);

  if (loading) {
    return <p>Cargando colección...</p>;
  }

  if (!collection) {
    return <p>Colección no encontrada.</p>;
  }

  const shareUrl = window.location.href;
  const shareText = `Mira mi carpeta "${collection.collection.name}" en PocketCollection`;

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copiado");
  };

  const openShareOptions = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PocketCollection",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <main className="collection-detail-page">
      <div className="collection-detail-header">
        <div>
          <h1>{collection.collection.name}</h1>
          <p>{collection.collection.description}</p>
        </div>

        <button className="share-button" onClick={openShareOptions}>
          Compartir carpeta
        </button>
      </div>

      <div className="collection-cards-grid">
        {collection.items.map((item: any) => (
          <article key={item.id} className="collection-card-item">
            <img
              src={`${item.imagen_url}/low.webp`}
              alt={item.nombre_es || item.nombre_en}
            />

            <h3>{item.nombre_es || item.nombre_en}</h3>

            <p>{item.condition}</p>
          </article>
        ))}
      </div>

      {showShareModal && (
        <div className="modal-overlay">
          <section className="modal-card">
            <h2>Compartir carpeta</h2>
            <p>Comparte tu colección con tus amigos.</p>

            <div className="share-options">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${shareText} ${shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Messenger / Facebook
              </a>

              <button onClick={copyShareLink}>Copiar link</button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowShareModal(false)}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}