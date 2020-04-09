let express = require('express');
let router = express.Router();

let createlist = require('./create-list');
let editlist = require('./edit-list');
let deletelist = require('./delete-list');

router.use('/create-list', createlist);
router.use('/edit-list', editlist);
router.use('/delete-list', deletelist);

module.exports = router;