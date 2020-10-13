var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req, res) {
    Bicicleta.allBicis(function(err, bicis) {
        if (err) console.log(err);
        res.status(200).json({
            Bicicleta: bicis
        })
    })
}

exports.bicicleta_create = function(req, res) {
    var ubicacion = [req.body.lat, req.body.lng];
    var bici = new Bicicleta({ code: req.body.id, color: req.body.color, modelo: req.body.modelo, ubicacion: ubicacion });

    Bicicleta.add(bici, function(err, newBici) {
        if (err) console.log(err);
        res.status(200).json({
            Bicicleta: bici
        })
    });
}

exports.bicicleta_find = function(req, res) {
    Bicicleta.findByCode(req.body.code, function(err, bici) {
        if (err) console.log(err);
        res.status(200).json({
            Bicicleta: bici
        })
    })
}

exports.bicicleta_delete = function(req, res) {
    Bicicleta.removeByCode(req.body.code, function(err, targetBici) {
        if (err) console.log(err);
        res.status(204).json();
    })
}