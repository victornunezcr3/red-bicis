var Usuario = require('../../models/usuario');

exports.usuario_list = function(req, res) {
    Usuario.find({}, function(error, usuarios) {
        if (error) console.error(error);
        res.render('usuarios/index', { usuarios: usuarios });
    });
};

exports.usuario_create_get = function(req, res) {
    res.render('usuarios/create');
};

exports.usuario_create_post = function(req, res) {
    let body = req.body;
    if (body.password === body.passwordConfirm) {
        var user = new Usuario({ nombre: body.nombre, email: body.email, password: body.password });
        Usuario.add(user, function(error, newUser) {
            if (error) console.error(error);
            newUser.enviarEmailBienvenida();
            res.redirect('/usuarios');
        });
    } else {
        console.error("Los campos de Password deben ser iguales, verifique los datos ingresados");
        res.redirect('/usuarios/create');
    }
};

exports.usuario_delete_post = function(req, res) {
    let email = req.body.email;
    console.log(req.body);
    Usuario.deleteOne({ email: email }, function(error) {
        if (error) console.log(error);
    });
    res.redirect('/usuarios');
}


exports.usuario_update_get = function(req, res) {
    Usuario.findByEmail(req.params.email, function(error, targetUsuario) {
        if (error) console.log(error);
        res.render('usuarios/update', { usuario: targetUsuario });
    });
}

exports.usuario_update_post = function(req, res) {
    let body = req.body;
    Usuario.findByEmail(body.email, function(error, user) {
        if (error) console.error(error);
        user.nombre = body.nombre;
        Usuario.update(user, function(error, newUser) {
            if (error) console.error(error);
            res.redirect('/usuarios');
        });
    });
}

exports.login_get = function(req, res) {
    res.render('usuarios/login');
};

exports.login_post = function(req, res) {
    var usuario = req.body.usuario;
    var password = req.body.password;
    Usuario.findByEmail(usuario, function(error, user) {
        if (error) console.error(error);
        let compare = user.validaPassword(password);
        if (!compare) {
            console.error('Usuario y/o Password inválido. Verifique los datos ingresados.');
        }
    });
};
exports.forgot_password_get = function(req, res) {
    res.render('usuarios/forgotpassword');
};

exports.forgot_password_post = function(req, res) {
    var usuario = req.body.usuario;
    Usuario.findByEmail(usuario, function(error, user) {
        if (error) console.error(error);

        user.enviarEmailBienvenida();
        res.redirect('/usuarios');
    });
};

exports.usuario_reservar = (req, res) => {
    Usuario.findById(req.body.id), (err, usuario) => {
        console.log(usuario);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, (err) => {
            console.log('reserva !!!!');
            res.status.send();
        });
    };
};