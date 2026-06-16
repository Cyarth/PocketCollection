const pool = require("../db/pool");

const getSets = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.tcgdex_id,
        s.codigo,
        s.nombre_en,
        s.total_cartas,
        s.logo_url,
        s.simbolo_url,
        sr.nombre_en AS serie
      FROM sets s
      INNER JOIN series sr
        ON sr.id = s.serie_id
      ORDER BY s.nombre_en
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSets,
};