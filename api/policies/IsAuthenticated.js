var jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  var token;

  if ( req.headers && req.headers.authorization ) {
    var parts = req.headers.authorization.split(' ');
    if ( parts.length == 2 ) {
      var scheme = parts[0],
        credentials = parts[1];

      if ( /^Bearer$/i.test(scheme) ) {
        token = credentials;
      }
    } else {
      return res.status( 401 ).json( { err: { status: 'danger', message: 'auth.policy.wrongFormat' }});
    }
  } else if ( req.param('token') ) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.status( 401 ).json({ err: { status: 'danger', message: 'auth.policy.noAuthorizationHeaderFound' }});
  }

  jwt.verify(token, sails.config.jwt.jwtSecret, function(err, decodedToken) {
    if ( err ) return res.status( 401).json({ err: { status: 'danger', message: 'auth.policy.invalidToken', detail: err }});

    req.token = decodedToken.sub;
  });

  next();
}