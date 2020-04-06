let express = require('express');
let router = express.Router();

let list = require('./list');
let listElement = require('./list-element');
let account = require('./account');

router.use('/list', list);
router.use('/element', listElement);
router.use('/account', account);

module.exports = router;