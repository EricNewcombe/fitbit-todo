module.exports = function( app ) {
    let mainNav = require('./main-nav');
    let api = require('./api');
    app.use('/', mainNav);
    app.use('/api', api);
}