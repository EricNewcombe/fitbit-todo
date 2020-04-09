const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../../../reference/server-responses');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../../../db');
const bcrypt = require('bcrypt');
const settings = require('../../../settings');
const jwt = require('jsonwebtoken')

const jsonParser = bodyParser.json({extended:false});


router.get('/', (req, res) => {
    res.send("login");
});

router.post('/', jsonParser, (req, res) => {

    const sendError = errorObject => {
        if ( errorObject.status !== 400 ) { console.error(`Error while logging in ${JSON.stringify(errorObject)}`) }
        
        try { return res.status(errorObject.status).json({ errorMessage: errorObject.message } ); } 
        catch (e) { return res.status(500).json( {...ERROR_MESSAGES.UNKNOWN_ERROR, errorObject } ); }
    };
    
    let data = req.body;

    // Ensure all fields are present and in the correct format
    if ( !data.email ) { return sendError( ERROR_MESSAGES.NO_EMAIL_SENT ); }
    if ( !data.password ) { return sendError( ERROR_MESSAGES.NO_PASSWORD_SENT ); }
    
    // Find the account with the associated email address and check password
    db.query("SELECT * FROM users WHERE email=$1", [data.email], (err, users) => {
        if ( err ) { return sendError( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
        if ( users.rows.length === 0 ) { return sendError( ERROR_MESSAGES.INVALID_USERNAME_OR_PASSWORD ) }

        let user = users.rows[0];

        bcrypt.compare(data.password, user.password, (err, result) => {
            if ( err ) { return sendError( { ...ERROR_MESSAGES.PASSWORD_COMPARE_ERROR, err } ); }
            if ( !result ) { return sendError( ERROR_MESSAGES.INVALID_USERNAME_OR_PASSWORD ); }
            
            // generate token and send it in a response object if valid
            let token = jwt.sign({ user_id: user.user_id }, settings.JWT_SECRET)
            res.status(200).json( { message: SUCCESS_MESSAGES.SUCCESSFUL_LOGIN, token} );
        });
    })
    
})

module.exports = router;