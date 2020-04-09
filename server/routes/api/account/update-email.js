const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    res.send("update-email");
});

module.exports = router;