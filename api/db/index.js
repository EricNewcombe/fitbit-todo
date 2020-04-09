const { Pool } = require('pg');
const settings = require('../settings');
const pool = new Pool({
  user: settings.PGUSER,
  host: settings.PGHOST,
  database: settings.PGDATABASE,
  password: settings.PGPASSWORD,
  port: settings.PGPORT
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}