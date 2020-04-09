const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../../../reference/server-responses');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../../../db');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const settings = require('../../../settings');

const jsonParser = bodyParser.json({extended:false});

router.get('/', function(req, res) {
    res.send("register");
});

router.post('/', jsonParser, function(req, res) {
    let data = req.body;

    new Promise( (resolve, reject) => {
        let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        // Ensure all fields are present and in the correct format
        if ( !data.email ) { return reject( ERROR_MESSAGES.NO_EMAIL_SENT ); }
        if ( !data.password ) { return reject( ERROR_MESSAGES.NO_PASSWORD_SENT ); }
        if ( !data.repeated_password ) { return reject( ERROR_MESSAGES.NO_SECOND_PASSWORD_SENT ); }

        try { Joi.assert( data.email, Joi.string().email() ); } 
        catch (e) { return reject( ERROR_MESSAGES.INVALID_EMAIL_ADDRESS ); }
        
        if ( pattern.test(data.password) === false ) { return reject( ERROR_MESSAGES.INVALID_PASSWORD_PATTERN ); }
        if ( data.password !== data.repeated_password ) { return reject( ERROR_MESSAGES.PASSWORD_UNEQUAL_TO_SECONDARY ) }
        
        // Check to see if the email already exists in the DB, continue if it is not
        db.query("SELECT * FROM users WHERE email=$1", [data.email], (err, response) => {
            if ( err ) { return reject( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
            if ( response.rows.length > 0 ) { return reject( ERROR_MESSAGES.USER_ALREADY_EXISTS ) }
            resolve();
        })
    })
    .then( () => {
        // Generate the salted password and insert into the database
		var salt = bcrypt.genSaltSync(settings.saltRounds);
		var hashedPassword = bcrypt.hashSync(data.password, salt);

        let query = 'INSERT INTO public."users" ("email", "password") VALUES ( $1, $2 )'
        db.query(query, [data.email, hashedPassword], (err, response) => {
            console.log(err, response);
            if ( err ) { return Promise.reject( ERROR_MESSAGES.ERROR_SAVING_USER_TO_DATABASE, err ) }
            return res.status(200).json( { message: SUCCESS_MESSAGES.ACCOUNT_CREATED_SUCCESSFULLY } )
        })

    })
    .catch( errorObject => {
        if ( errorObject.status !== 400 ) { console.error(`Error while registering ${JSON.stringify(errorObject)}`) }
        
        try { return res.status(errorObject.status).json({ errorMessage: errorObject.message } ); } 
        catch (e) { return res.status(500).json( {...ERROR_MESSAGES.UNKNOWN_ERROR, errorObject } ); }
	});
});

module.exports = router;