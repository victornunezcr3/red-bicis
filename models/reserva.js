// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var moment = require('moment');

// Usaremos los esquemas
var Schema = mongoose.Schema;

// Creamos el objeto del esquema y tendrá dos campos de tipo String
var reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bicicleta'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

reservaSchema.methods.diasReserva = function() {
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1;
}

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Reserva', reservaSchema);