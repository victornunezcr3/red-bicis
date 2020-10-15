// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
var saltRounds = 10;
const uniqueValidator = require('mongoose-unique-validator');

var Token = require('./token');
const mailer = require('../mailer/mailer');
const crypto = require('crypto');

// Usaremos los esquemas
var Schema = mongoose.Schema;

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

// Creamos el objeto del esquema
var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'No tiene un formato el email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    },
    googleId: String,
    facebookId: String
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString("hex"),
    });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) {
            return cb(err);
        }
        const mailOptions = {
            from: "no-reply@redbicicletas.com",
            to: email_destination,
            subject: "Restablecimiento de contraseña",
            text: "Hola,\n\n" +
                "Por favor, para resetear el password de su cuenta haga click en este link:\n" +
                "http://localhost:3000" +
                "/resetPassword/" +
                token.token +
                ".\n",
        };
        mailer.sendMail(mailOptions, function(err) {
            if (err) {
                return cb(err);
            }
            console.log('Se envio un email para resetear el password a:' + email_destination + '.');
        });
        cb(null);
    });
};

usuarioSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.statics.add = function(aUser, cb) {
    return this.create(aUser, cb);
};

usuarioSchema.statics.findByEmail = function(aEmail, cb) {
    return this.findOne({ email: aEmail }, cb);
};

usuarioSchema.statics.update = function(aUser, cb) {
    return this.updateOne({ email: aUser.email }, aUser, cb);
};

usuarioSchema.methods.validaPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reservas = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
    console.log(reservas);
    reservas.save(cb);
};

usuarioSchema.methods.enviarEmailBienvenida = function(cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString("hex")
    });
    const emailDestination = this.email;

    token.save(function(error) {
        if (error) {
            return console.log(error.message);
        }
        const mailOption = {
            from: 'no-reply@redbicicletas.com',
            to: emailDestination,
            subject: 'Verificacion de cuenta',
            text: 'Hola \n\n' +
                'Por favor, para verificar su cuenta haga click en el siguiente link:\n\n' +
                'http://localhost:3000' + '/token/confirmacion/' + token.token + '\n'
        };

        mailer.sendMail(mailOption, function(error) {
            if (error) {
                return console.log(error.message);
            }

            console.log('Se ha enviado correo de verifiacion a:' + emailDestination);
        });
    });
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    var reserva = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta });
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            { 'googleId': condition.id }, { 'email': condition.emails[0].value }
        ]
    }, (err, result) => {
        if (result) {
            callback(err, result)
        } else {
            console.log('============ CONDITION =========');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.name = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = 'oauth'; //condition._json.etag;
            console.log('============ VALUES =========');
            console.log(values);
            self.createImageBitmap(values, (err, result) => {
                if (err) { console.log(err); }
                return callback(err, result)
            })
        }
    })
};

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            { 'facebookId': condition.id }, { 'email': condition.emails[0].value }
        ]
    }, (err, result) => {
        if (result) {
            callback(err, result)
        } else {
            console.log('============ CONDITION =========');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');
            console.log('============ VALUES =========');
            console.log(values);
            self.create(values, (err, result) => {
                if (err) { console.log(err); }
                return callback(err, result)
            })
        }
    })
};

// Exportamos el modelo para usarlo en otros ficheros

module.exports = mongoose.model('Usuario', usuarioSchema);