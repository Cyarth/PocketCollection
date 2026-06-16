const pool = require("../db/pool");

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
        c.*,
        s.nombre_en AS set_nombre,
        sr.nombre_en AS serie_nombre
      FROM cards c
      INNER JOIN sets s ON s.id = c.set_id
      INNER JOIN series sr ON sr.id = s.serie_id
      WHERE c.tcgdex_id = $1
      LIMIT 1
      `,
      [tcgdexId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Carta no encontrada",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo detalle de carta",
      error: error.message,
    });
  }
};

module.exports = {
  getCards,
  searchCards,
  getCardByTcgdexId,
};