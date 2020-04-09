const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../settings');

module.exports = function ( req, res, next ) {
    let token = req.cookies['session_info'];
    console.log(`Token: ${token}`);

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, userInfo) => {
            if (err) {
                return res.redirect('/login');
            } else {
                req.authError= false;
                req.userInfo = userInfo;
                next();
            }
        });
    } else {
        return res.redirect('/login');
    }
}