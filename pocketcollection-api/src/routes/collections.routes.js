const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        uc.id,
        uc.name,
        uc.description,
        uc.created_at,
        COALESCE(SUM(uci.quantity), 0) AS total_cards
      FROM user_collections uc
      LEFT JOIN user_collection_items uci
        ON uci.collection_id = uc.id
      WHERE uc.user_id = $1
      GROUP BY uc.id
      ORDER BY uc.created_at DESC
      `,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo colecciones:", error);
    return res.status(500).json({ message: "Error obteniendo colecciones" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const result = await pool.query(
      `
      INSERT INTO user_collections (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_at
      `,
      [req.user.id, name, description || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando colección:", error);
    return res.status(500).json({ message: "Error creando colección" });
  }
});

router.post("/:collectionId/items", authMiddleware, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const {
      card_id,
      quantity,
      condition,
      language,
      is_foil,
      purchase_price,
    } = req.body;

    if (!card_id) {
      return res.status(400).json({ message: "card_id es obligatorio" });
    }

    const collectionResult = await pool.query(
      `
      SELECT id
      FROM user_collections
      WHERE id = $1
      AND user_id = $2
      `,
      [collectionId, req.user.id]
    );

    if (collectionResult.rows.length === 0) {
      return res.status(404).json({ message: "Colección no encontrada" });
    }

    const result = await pool.query(
      `
      INSERT INTO user_collection_items (
        collection_id,
        card_id,
        quantity,
        condition,
        language,
        is_foil,
        purchase_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        collectionId,
        card_id,
        quantity || 1,
        condition || "Near Mint",
        language || "English",
        is_foil || false,
        purchase_price || null,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error agregando carta a colección:", error);
    return res.status(500).json({
      message: "Error agregando carta a colección",
    });
  }
});

router.get("/:collectionId", authMiddleware, async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collectionResult = await pool.query(
      `
      SELECT
        id,
        name,
        description,
        created_at
      FROM user_collections
      WHERE id = $1
      AND user_id = $2
      `,
      [collectionId, req.user.id]
    );

    if (collectionResult.rows.length === 0) {
      return res.status(404).json({ message: "Colección no encontrada" });
    }

    const itemsResult = await pool.query(
      `
      SELECT
        uci.id,
        uci.card_id,
        uci.quantity,
        uci.condition,
        uci.language,
        uci.is_foil,
        c.nombre_es,
        c.nombre_en,
        c.rareza,
        c.imagen_url
      FROM user_collection_items uci
      INNER JOIN cards c
        ON c.tcgdex_id = uci.card_id
      WHERE uci.collection_id = $1
      ORDER BY uci.created_at DESC
      `,
      [collectionId]
    );

    return res.json({
      collection: collectionResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error obteniendo colección:", error);
    return res.status(500).json({ message: "Error obteniendo colección" });
  }
});

module.exports = router;