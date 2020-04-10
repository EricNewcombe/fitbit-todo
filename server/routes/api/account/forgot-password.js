const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../../../reference/server-responses');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const settings = require('../../../settings');
const db = require('../../../db');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    port: settings.OUTBOUND_EMAIL_PORT,
    host: settings.OUTBOUND_EMAIL_HOST,
    secure: true,
    auth: {
      user: settings.OUTBOUND_EMAIL,
      pass: settings.OUTBOUND_EMAIL_PASSWORD
    }
});


router.get('/', function(req, res) {
    res.send("forgot-password");
});

router.post('/', (req, res) => {
    const sendError = errorObject => {
        if ( errorObject.status !== 400 ) { console.error(`Error while registering ${JSON.stringify(errorObject)}`) }
        
        try { return res.status(errorObject.status).json({ errorMessage: errorObject.message } ); } 
        catch (e) { return res.status(500).json( {...ERROR_MESSAGES.UNKNOWN_ERROR, errorObject } ); }
    };

    if ( !data.email ) { return sendError( ERROR_MESSAGES.NO_EMAIL_SENT ) }

    db.query('SELECT * FROM users WHERE email=$1', [data.email], (err, response) => {
        if ( err ) { return sendError( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
        if ( response.rows.length === 0 ) { return res.status(200).json( { message: SUCCESS_MESSAGES.EMAIL_SENT_IF_EXISTS } ) }

        // Generate the token to be used for the user
        crypto.randomBytes(20, async function(error, buf) {
            if ( error ) { return sendError( ERROR_MESSAGES.ERROR_GENERATING_RESET_TOKEN ); }
    
            // Save the token to the user to be looked up by the link and set the expiriy time to be 1 hour later
            let resetPasswordToken = buf.toString('hex');;
            let resetPasswordExpires = Date.now() + 3600000; // 1 hour
            
            // Save to the rest_tokens table

            // Send email
        });
    });
})

module.exports = router;