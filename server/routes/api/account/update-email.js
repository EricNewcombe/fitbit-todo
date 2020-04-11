const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../../../reference/server-responses');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const settings = require('../../../settings');
const db = require('../../../db');
const Joi = require('@hapi/joi');

const jsonParser = bodyParser.json({extended:false});
const auth = require('../../middleware/auth');


router.get('/', function(req, res) {
    res.send("update-email");
});

router.post('/', auth, jsonParser, async (req, res) => {
    let user_id = req.userInfo.user_id;
    let data = req.body;

    if ( !user_id ) { return handleError( ERROR_MESSAGES.UNKNOWN_ERROR, res ) }
    if ( !data.updated_email ) { return handleError( ERROR_MESSAGES.NO_EMAIL_TO_UPDATE_SENT, res ) }

    try { Joi.assert( data.updated_email, Joi.string().email() ); } 
    catch (e) { return sendError( ERROR_MESSAGES.INVALID_EMAIL_ADDRESS, res ); }

    // ensure email isn't already in use
    let userWithEmail = await db.findUserByEmail(data.updated_email).catch( (err) => { handleError(err, res) } );
    if ( userWithEmail !== null ) { return handleError( ERROR_MESSAGES.USER_ALREADY_EXISTS, res ) }

    // find user
    db.findUserByID(user_id)
        .then( (user) => {
            if ( user === null ) { return Promise.reject( ERROR_MESSAGES.UNABLE_TO_FIND_USER ) }
            let query = 'UPDATE users SET email = $1 WHERE user_id=$2'
            db.query(query, [data.updated_email, user_id], (error, result) => {
                if ( error ) { return sendError( {...ERROR_MESSAGES.ERROR_SAVING_USER_TO_DATABASE, error}, res ) }
                res.status(200).json( { message: SUCCESS_MESSAGES.ACCOUNT_UPDATED_SUCCESSFULLY } );
            })
        })
        .catch( (err) => { handleError(err, res) } );

})

const handleError = (errorObject, res) => {
    if ( errorObject.status !== 400 ) { console.error(`Error while sending forgot password token  ${JSON.stringify(errorObject)}`) }
    
    try { return res.status(errorObject.status).json({ errorMessage: errorObject.message } ); } 
    catch (e) { return res.status(500).json( {...ERROR_MESSAGES.UNKNOWN_ERROR, errorObject } ); }
};

module.exports = router;