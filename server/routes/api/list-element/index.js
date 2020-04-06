let express = require('express');
let router = express.Router();

let createElement = require('./create-element');
let editElement = require('./edit-element');
let deleteElement = require('./delete-element');

router.use('/create-element', createElement);
router.use('/edit-element', editElement);
router.use('/delete-element', deleteElement);

module.exports = router;