const express = require('express');
const router = express.Router();
const db = require('../../db');


router.get('/', function(req, res) {
    db.query('SELECT * from users', (err, response) => {
        // console.log(err, response);
        res.json(response.rows);
    })
});

module.exports = router;