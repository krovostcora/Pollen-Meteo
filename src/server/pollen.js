// src/server/pollen.js
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

const tableMap = {
  Vilnius: { table: 'hirst_ltviln_bi_hourly_data', dateColumn: 'LTVILN' },
  Siauliai: { table: 'hirst_ltsiau_bi_hourly_data', dateColumn: 'LTSIAU' },
  Klaipeda: { table: 'hirst_ltklai_bi_hourly_data', dateColumn: 'LTKLAI' },
};

const validMorphotypes = [
  "ALNU", "ARTE", "AMBR", "CORY", "BETU", "QUER", "PINA", "POAC", "SALI", "POPU", "ACER"
];

router.post('/pollen', async (req, res) => {
  const { stationName, startDate, endDate, morphotypes, granularity } = req.body;

  if (!stationName || !startDate || !endDate || !Array.isArray(morphotypes)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  const stationData = tableMap[stationName];
  if (!stationData) {
    return res.status(400).json({ error: 'Invalid station name' });
  }

  const filteredMorphotypes = morphotypes.filter(m => validMorphotypes.includes(m));
  if (filteredMorphotypes.length === 0) {
    return res.status(400).json({ error: 'No valid morphotypes selected' });
  }

  const { table, dateColumn } = stationData;
  const query = format(
      'SELECT * FROM %I WHERE DATE(%I) BETWEEN $1 AND $2 AND "Particle" = ANY($3) ORDER BY %I, "Particle" LIMIT 10000',
      table, dateColumn, dateColumn
  );

  try {
    const result = await pool.query(query, [startDate, endDate, filteredMorphotypes]);
    if (granularity === 'daily') {
      // Aggregate and pivot to daily
      const daily = {};
      result.rows.forEach(row => {
        const day = row[dateColumn] instanceof Date ? row[dateColumn].toISOString().slice(0, 10) : row[dateColumn];
        if (!daily[day]) daily[day] = { time: day };
        const total = [
          "00-02","02-04","04-06","06-08","08-10","10-12",
          "12-14","14-16","16-18","18-20","20-22","22-24"
        ].reduce((sum, h) => sum + (Number(row[h]) || 0), 0);
        daily[day][`${row.Particle}_total`] = (daily[day][`${row.Particle}_total`] || 0) + total;
      });
      res.json(Object.values(daily));
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

module.exports = router;