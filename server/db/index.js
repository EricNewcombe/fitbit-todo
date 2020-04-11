const { Pool } = require('pg');
const settings = require('../settings');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../reference/server-responses');
const pool = new Pool({
  user: settings.PGUSER,
  host: settings.PGHOST,
  database: settings.PGDATABASE,
  password: settings.PGPASSWORD,
  port: settings.PGPORT
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}

const findUserByEmail = email => {
  findUserQuery = 'SELECT * FROM users WHERE email=$1'
  return new Promise( (resolve, reject) => {
    query(findUserQuery, [email], (error, response) => {
      if ( error ) { return reject( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
      if ( response.rows.length === 0 ) { return resolve(null) }
      return resolve(response[0]);
    })
  })
}

const findUserByID = user_id => {
  findUserQuery = 'SELECT * FROM users WHERE user_id=$1'
  return new Promise( (resolve, reject) => {
    query(findUserQuery, [user_id], (error, response) => {
      if ( error ) { return reject( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
      if ( response.rows.length === 0 ) { return resolve(null) }
      return resolve(response[0]);
    })
  })
}

module.exports = {
  query, findUserByEmail, findUserByID
}