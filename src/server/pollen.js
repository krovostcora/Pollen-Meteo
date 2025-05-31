const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
  user: 'postgres',
  host: '5.199.168.209',
  database: 'devicesdata',
  password: '64532',
  port: 5432,
});

// Map UI station names to DB tables and date columns
const tableMap = {
  Vilnius: { table: 'hirst_ltviln_bi_hourly_data', dateColumn: 'LTVILN' },
  Siauliai: { table: 'hirst_ltsiau_bi_hourly_data', dateColumn: 'LTSIAU' },
  Klaipeda: { table: 'hirst_ltklai_bi_hourly_data', dateColumn: 'LTKLAI' },
};

// Valid morphotype codes
const validMorphotypes = [
  "ALNU", "ARTE", "AMBR", "CORY", "BETU", "QUER", "PINA", "POAC", "SALI", "POPU", "ACER"
];

router.post('/pollen', async (req, res) => {
  const { stationName, startDate, endDate, morphotypes, granularity } = req.body;
  console.log('Request body:', req.body);

  if (!stationName || !startDate || !endDate || !Array.isArray(morphotypes)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  const stationData = tableMap[stationName];
  if (!stationData) {
    return res.status(400).json({ error: 'Invalid station name' });
  }

  // Filter morphotypes to only valid ones
  const filteredMorphotypes = morphotypes.filter(m => validMorphotypes.includes(m));
  if (filteredMorphotypes.length === 0) {
    return res.status(400).json({ error: 'No valid morphotypes selected' });
  }

  const { table, dateColumn } = stationData;

  let query;
  if (granularity === 'daily') {
    // Aggregate by day (sum all hourly columns for each day)
    query = format(
        `SELECT "%I" as date, "Particle",
                COALESCE("00-02",0)+COALESCE("02-04",0)+COALESCE("04-06",0)+COALESCE("06-08",0)+
                COALESCE("08-10",0)+COALESCE("10-12",0)+COALESCE("12-14",0)+COALESCE("14-16",0)+
                COALESCE("16-18",0)+COALESCE("18-20",0)+COALESCE("20-22",0)+COALESCE("22-24",0) as total
         FROM %I
         WHERE DATE(%I) BETWEEN $1 AND $2 AND "Particle" = ANY($3)
         ORDER BY %I, "Particle"
         LIMIT 100`,
        dateColumn, table, dateColumn, dateColumn
    );
  } else {
    // Return all hourly columns for each day
    query = format(
        'SELECT * FROM %I WHERE DATE(%I) BETWEEN $1 AND $2 AND "Particle" = ANY($3) ORDER BY %I, "Particle" LIMIT 100',
        table, dateColumn, dateColumn
    );
  }
  console.log('Generated query:', query);
  console.log('Parameters:', [startDate, endDate, filteredMorphotypes]);

  try {
    const result = await pool.query(query, [startDate, endDate, filteredMorphotypes]);
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

module.exports = router;