const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../../../reference/server-responses');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const settings = require('../../../settings');
const db = require('../../../db');
const crypto = require('crypto');

const jsonParser = bodyParser.json({extended:false});

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

router.post('/', jsonParser, async (req, res) => {
    let data = req.body;

    if ( !data.email ) { return handleError( ERROR_MESSAGES.NO_EMAIL_SENT, res ) }
    
    let user = await findUser(data.email).catch( (err) => handleError(err, res) );
    
    if ( user ) {

        let insertNewEntry = await checkIfUserHasToken(user).catch( (err) => handleError(err, res) )
        let {resetPasswordToken, resetPasswordExpires} = await generateToken().catch( (err) => handleError(err, res) )

        saveToken(user, insertNewEntry, resetPasswordToken, resetPasswordExpires)
            .then( emailToken(user.email, resetPasswordToken) )
            .then( res.status(200).json( { message: SUCCESS_MESSAGES.EMAIL_SENT_IF_EXISTS  } ) )
            .catch( err => { handleError(err, res); })

    } else {
        return handleError( ERROR_MESSAGES.EMAIL_DOES_NOT_EXIST, res )
    }

})

const handleError = (errorObject, res) => {
    if ( errorObject.status !== 400 ) { console.error(`Error while sending forgot password token  ${JSON.stringify(errorObject)}`) }
    
    try { return res.status(errorObject.status).json({ errorMessage: errorObject.message } ); } 
    catch (e) { return res.status(500).json( {...ERROR_MESSAGES.UNKNOWN_ERROR, errorObject } ); }
};

const emailToken = ( destinationEmail, token ) => {
    return new Promise( (resolve, reject) => {
        // Generate the web address to be sent in the email
        
        var resetAddress = `https://${settings.SITE_BASE_URL}/reset-password/${token}`;

        // Construct the email
        var mailOptions = {
            from: settings.OUTBOUND_EMAIL,
            to: destinationEmail,
            subject: 'Forgot Password',
            html: `<p>We have received a request to reset your password.</p>
            <p>Click the link below to reset it. This link will be active for one hour after you receive it.</p>
            <a href="${resetAddress}">Reset Password</a>
            <p>If you are unable to click the address, enter this link in the address bar ${resetAddress}</p>`
        };

        // Send the email to the recipient
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(`Error sending password reset email to ${destinationEmail}. ${error}`);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    });
}

const findUser = email => {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM users WHERE email=$1', [email], (err, response) => {
            if ( err ) { return reject( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
            
            let user = response.rows.length === 1 ? response.rows[0] : null;
            return resolve(user);
        });
    })
}

const checkIfUserHasToken = user => {
    return new Promise( (resolve, reject) => {
        let findQuery = 'SELECT * FROM reset_password_tokens WHERE token_owner=$1';
        db.query(findQuery, [user.user_id], (error, result ) => {
            if ( error ) { return reject( ERROR_MESSAGES.ERROR_WHILE_FINDING_ACCOUNT ) }
            resolve(result.rows.length !== 0);
        });
    });
}

const generateToken = () => {
    return new Promise( (resolve, reject) => {
        crypto.randomBytes(20, function(error, buf) {
            if ( error ) { return reject( ERROR_MESSAGES.ERROR_GENERATING_RESET_TOKEN ); }
            let expiryTime = Date.now() + 60*60*1000; // Token expires one hour after request called
            let resetPasswordToken = buf.toString('hex');;
            let resetPasswordExpires = new Date(expiryTime).toISOString().slice(0, 19).replace('T', ' ');
            resolve({resetPasswordToken, resetPasswordExpires});
        });
    });
}

const saveToken = ( user, newEntry, resetPasswordToken, resetPasswordExpires) => {
    return new Promise( (resolve, reject) => {
        let updateQuery = 'UPDATE reset_password_tokens SET token_value = $1 WHERE token_owner=$2';
        let insertQuery = 'INSERT INTO reset_password_tokens ("expiry_date", "token_owner", "token_value") VALUES ($1, $2, $3)'
        
        if ( newEntry ) {
            db.query(insertQuery, [resetPasswordExpires, user.user_id, resetPasswordToken], (error, result) => {
                if ( error ) { return reject( ERROR_MESSAGES.ERROR_SAVING_RESET_TOKEN, error ) }
            })
        } else {
            db.query(updateQuery, [resetPasswordToken, user.user_id], (error, result) => {
                if ( error ) { return reject( ERROR_MESSAGES.ERROR_SAVING_RESET_TOKEN, error ) }
            })
        }
    });
}

module.exports = router;