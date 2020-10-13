var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
const { populate } = require('../../models/bicicleta');


describe('Testing Usuarios', function() {
    beforeEach(function(done) {
        var mongoDB = 'mongodb+srv://ingvictormlnunez:Manolo842703*@cluster0.qskup.mongodb.net/test';
        mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('we are connected to mongo database biciletas');

            done();
        });
    });

    afterEach(function(done) {
        Reserva.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            usuario.deleteMany({}, function(err, success) {
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success) {
                    if (err) console.log(err);
                    done();
                });
            })
        });
    });

    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Victorml' });
            usuario.save();
            const bicicleta = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() + 1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reserva) {
                    console.log(reserva[0]);
                    expect(reserva.length).toBe(1);
                    expect(reserva[0].diasDeReserva()).toBe(2);
                    expect(reserva[0].bicicleta.code).toBe(1);
                    expect(reserva[0].usuario.nombre).toBe(usuario.nombre);
                    done();

                });
            });
        });
    });
});