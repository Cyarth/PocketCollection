const pool = require("../db/pool");

const getSeries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM series
      ORDER BY nombre_es
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSeries,
};