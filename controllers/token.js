var Usuario = require('../models/usuario');
var Token = require('../models/token');

exports.confirmacion_get = function(req, res) {
    let tokenGet = req.params.token;
    Token.findOne({ token: tokenGet }, function(error, token) {
        if (error) console.error(error);
        if (token) {
            Usuario.findById(token._userId, function(error, usuario) {
                if (error) console.error(error);
                if (usuario) {
                    usuario.verificado = true;
                    usuario.save(function(error) {
                        if (error) console.error(error);
                        res.redirect('/');
                    });
                }
            });
        }
    });
}