let express = require('express');
let router = express.Router();

let login = require('./login');
let register = require('./register');
let forgotPassword = require('./forgot-password');
let updatePassword = require('./update-password');
let updateEmail = require('./update-email');

router.use('/login', login);
router.use('/register', register);
router.use('/forgot-password', forgotPassword);
router.use('/update-email', updateEmail);
router.use('/update-password', updatePassword);

module.exports = router;