const pool = require("../db/pool");
const tcgdexService = require("../services/tcgdex.service");

const importSeries = async (req, res) => {
  try {
    const series = await tcgdexService.getSeries();

    let created = 0;
    let updated = 0;

    for (const item of series) {
      const result = await pool.query(
        `
        INSERT INTO series (
          tcgdex_id,
          nombre_es,
          nombre_en
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (tcgdex_id)
        DO UPDATE SET
          nombre_es = EXCLUDED.nombre_es,
          nombre_en = EXCLUDED.nombre_en,
          updated_at = NOW()
        RETURNING xmax
        `,
        [
          item.id,
          item.name,
          item.name
        ]
      );

      if (result.rows[0].xmax === "0") {
        created++;
      } else {
        updated++;
      }
    }

    await pool.query(
      `
      INSERT INTO import_logs (
        fuente,
        tipo_importacion,
        estado,
        registros_procesados,
        registros_creados,
        registros_actualizados,
        fecha_fin
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        "TCGdex",
        "series",
        "success",
        series.length,
        created,
        updated
      ]
    );

    res.json({
      message: "Series importadas correctamente",
      processed: series.length,
      created,
      updated
    });
  } catch (error) {
    await pool.query(
      `
      INSERT INTO import_logs (
        fuente,
        tipo_importacion,
        estado,
        errores,
        fecha_fin
      )
      VALUES ($1, $2, $3, $4, NOW())
      `,
      [
        "TCGdex",
        "series",
        "error",
        error.message
      ]
    );

    res.status(500).json({
      message: "Error importando series",
      error: error.message
    });
  }
};

const importSets = async (req, res) => {
  try {
    const sets = await tcgdexService.getSets();

    let created = 0;
    let updated = 0;

    for (const item of sets) {
      const seriePrefix = item.id.replace(/[0-9.]/g, "");

      const serieResult = await pool.query(
        `
        SELECT id
        FROM series
        WHERE tcgdex_id = $1
        LIMIT 1
        `,
        [seriePrefix]
      );

      if (serieResult.rows.length === 0) {
        continue;
      }

      const serieId = serieResult.rows[0].id;

      const result = await pool.query(
        `
        INSERT INTO sets (
          tcgdex_id,
          serie_id,
          codigo,
          nombre_es,
          nombre_en,
          total_cartas,
          logo_url,
          simbolo_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (tcgdex_id)
        DO UPDATE SET
          serie_id = EXCLUDED.serie_id,
          codigo = EXCLUDED.codigo,
          nombre_es = EXCLUDED.nombre_es,
          nombre_en = EXCLUDED.nombre_en,
          total_cartas = EXCLUDED.total_cartas,
          logo_url = EXCLUDED.logo_url,
          simbolo_url = EXCLUDED.simbolo_url,
          updated_at = NOW()
        RETURNING xmax
        `,
        [
          item.id,
          serieId,
          item.id,
          item.name,
          item.name,
          item.cardCount?.total || null,
          item.logo || null,
          item.symbol || null,
        ]
      );

      if (result.rows[0].xmax === "0") {
        created++;
      } else {
        updated++;
      }
    }

    await pool.query(
      `
      INSERT INTO import_logs (
        fuente,
        tipo_importacion,
        estado,
        registros_procesados,
        registros_creados,
        registros_actualizados,
        fecha_fin
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      ["TCGdex", "sets", "success", sets.length, created, updated]
    );

    res.json({
      message: "Sets importados correctamente",
      processed: sets.length,
      created,
      updated,
    });
  } catch (error) {
    await pool.query(
      `
      INSERT INTO import_logs (
        fuente,
        tipo_importacion,
        estado,
        errores,
        fecha_fin
      )
      VALUES ($1, $2, $3, $4, NOW())
      `,
      ["TCGdex", "sets", "error", error.message]
    );

    res.status(500).json({
      message: "Error importando sets",
      error: error.message,
    });
  }
};

const importCardsBySet = async (req, res) => {
  try {
    const { setId } = req.params;

    const setData = await tcgdexService.getSetById(setId);

    const setResult = await pool.query(
      `
      SELECT id
      FROM sets
      WHERE tcgdex_id = $1
      LIMIT 1
      `,
      [setId]
    );

    if (setResult.rows.length === 0) {
      return res.status(404).json({
        message: `El set ${setId} no existe en la base de datos`,
      });
    }

    const dbSetId = setResult.rows[0].id;

    let created = 0;
    let updated = 0;

    for (const cardRef of setData.cards || []) {
      const card = await tcgdexService.getCardById(cardRef.id);

      const result = await pool.query(
        `
        INSERT INTO cards (
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
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (tcgdex_id)
        DO UPDATE SET
          set_id = EXCLUDED.set_id,
          numero = EXCLUDED.numero,
          nombre_es = EXCLUDED.nombre_es,
          nombre_en = EXCLUDED.nombre_en,
          rareza = EXCLUDED.rareza,
          categoria = EXCLUDED.categoria,
          hp = EXCLUDED.hp,
          etapa = EXCLUDED.etapa,
          regulacion = EXCLUDED.regulacion,
          imagen_url = EXCLUDED.imagen_url,
          ilustrador = EXCLUDED.ilustrador,
          updated_at = NOW()
        RETURNING xmax
        `,
        [
          card.id,
          dbSetId,
          card.localId,
          card.name,
          card.name,
          card.rarity || null,
          card.category || null,
          card.hp || null,
          card.stage || null,
          card.regulationMark || null,
          card.image || null,
          card.illustrator || null,
        ]
      );

      if (result.rows[0].xmax === "0") {
        created++;
      } else {
        updated++;
      }
    }

    await pool.query(
      `
      INSERT INTO import_logs (
        fuente,
        tipo_importacion,
        estado,
        registros_procesados,
        registros_creados,
        registros_actualizados,
        fecha_fin
      )
      VALUES ($1,$2,$3,$4,$5,$6,NOW())
      `,
      [
        "TCGdex",
        `cards:${setId}`,
        "success",
        setData.cards?.length || 0,
        created,
        updated,
      ]
    );

    res.json({
      message: `Cartas del set ${setId} importadas correctamente`,
      set: setData.name,
      processed: setData.cards?.length || 0,
      created,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error importando cartas",
      error: error.message,
    });
  }
};

const importCardsBySerie = async (req, res) => {
  try {
    const { serieId } = req.params;

    const setsResult = await pool.query(
      `
      SELECT s.tcgdex_id
      FROM sets s
      INNER JOIN series sr ON sr.id = s.serie_id
      WHERE sr.tcgdex_id = $1
      ORDER BY s.tcgdex_id
      `,
      [serieId]
    );

    if (setsResult.rows.length === 0) {
      return res.status(404).json({
        message: `No se encontraron sets para la serie ${serieId}`,
      });
    }

    let totalProcessed = 0;
    let totalCreated = 0;
    let totalUpdated = 0;
    const importedSets = [];

    for (const setRow of setsResult.rows) {
      const fakeReq = {
        params: {
          setId: setRow.tcgdex_id,
        },
      };

      let partialResult = null;

      const fakeRes = {
        json: (data) => {
          partialResult = data;
        },
        status: () => fakeRes,
      };

      await importCardsBySet(fakeReq, fakeRes);

      if (partialResult) {
        totalProcessed += partialResult.processed || 0;
        totalCreated += partialResult.created || 0;
        totalUpdated += partialResult.updated || 0;
        importedSets.push({
          setId: setRow.tcgdex_id,
          set: partialResult.set,
          processed: partialResult.processed,
          created: partialResult.created,
          updated: partialResult.updated,
        });
      }
    }

    res.json({
      message: `Cartas de la serie ${serieId} importadas correctamente`,
      setsProcessed: importedSets.length,
      totalProcessed,
      totalCreated,
      totalUpdated,
      importedSets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error importando cartas por serie",
      error: error.message,
    });
  }
};

module.exports = {
  importSeries,
  importSets,
  importCardsBySet,
  importCardsBySerie,
};