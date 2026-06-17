const pool = require("../config/db");

const getCards = async (req, res) => {
  try {
    const { set } = req.query;

    let query = `
      SELECT
        c.id,
        c.tcgdex_id,
        c.numero,
        c.nombre_en,
        c.rareza,
        c.categoria,
        c.hp,
        c.etapa,
        c.regulacion,
        c.imagen_url,
        c.ilustrador,
        s.nombre_en AS set_nombre
      FROM cards c
      INNER JOIN sets s ON s.id = c.set_id
    `;

    const params = [];

    if (set) {
      query += ` WHERE s.tcgdex_id = $1`;
      params.push(set);
    }

    query += ` ORDER BY c.set_id, CAST(NULLIF(c.numero, '') AS INTEGER) NULLS LAST`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo cartas",
      error: error.message,
    });
  }
};

const searchCards = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Debes enviar el parámetro name",
      });
    }

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.tcgdex_id,
        c.numero,
        c.nombre_en,
        c.rareza,
        c.imagen_url,
        s.nombre_en AS set_nombre
      FROM cards c
      INNER JOIN sets s ON s.id = c.set_id
      WHERE c.nombre_en ILIKE $1
      ORDER BY c.nombre_en
      LIMIT 50
      `,
      [`%${name}%`]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error buscando cartas",
      error: error.message,
    });
  }
};

const getCardByTcgdexId = async (req, res) => {
  try {
    const { tcgdexId } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        tcgdex_id,
        set_id,
        numero,
        nombre_es,
        nombre_en,
        rareza,
        categoria,
        hp,
        etapa,
        regulacion,
        imagen_url,
        ilustrador
      FROM cards
      WHERE tcgdex_id = $1
      `,
      [tcgdexId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo carta:", error);
    return res.status(500).json({ message: "Error obteniendo carta" });
  }
};


module.exports = {
  getCards,
  searchCards,
  getCardByTcgdexId,
};