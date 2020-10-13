var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number],
        index: {
            type: '2dsphere',
            sparse: true
        }
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function() {
    return 'id: ' + this.id + 'code: ' + this.code + ', color: ' + this.color + ', modelo: ' +
        this.modelo + ', ubicacion: ' + this.ubicacion;
};

bicicletaSchema.statics.allBicis = function(cb) {
    return this.find({}, cb);
};

bicicletaSchema.statics.add = function(aBici, cb) {
    this.create(aBici, cb);
};

bicicletaSchema.statics.findById = function(id, cb) {
    return this.findOne({ id: id }, cb);
};

bicicletaSchema.statics.findByCode = function(aCode, cb) {
    return this.findOne({ code: aCode }, cb);
};

bicicletaSchema.statics.removeByCode = function(aCode, cb) {
    return this.deleteOne({ code: aCode }, cb);
};

bicicletaSchema.statics.deleteById = async function(id) {
    return await this.deleteOne({ id: id });
};

module.exports = new mongoose.model('Bicicleta', bicicletaSchema);

/* var Bicicleta = function(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function() {
    return 'id: ' + this.id + ', color: ' + this.color + ', modelo: ' + this.modelo + ', ubicacion: ' + this.ubicacion;
}

Bicicleta.findById = function(aBiciId) {
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId)
    if (aBici) {
        return aBici;
    } else {
        throw new Error(`No existe bicicleta con id: ${aBiciId}`);
    }
}

Bicicleta.removeById = function(aBiciId) {
    var aBici = Bicicleta.findById(aBiciId);
    for (let index = 0; index < Bicicleta.allBicis.length; index++) {
        if (Bicicleta.allBicis[index].id == aBiciId) {
            Bicicleta.allBicis.splice(index, 1);
            break;
        }
    }
}

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici) {
    Bicicleta.allBicis.push(aBici);
}

var a = new Bicicleta(1, 'rojo', 'urbana', [10.211539, -83.897455]);
var b = new Bicicleta(2, 'blanca', 'urbana', [10.226569, -83.903271]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta; */