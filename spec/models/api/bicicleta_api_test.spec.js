var request = require('request');
var Bicicleta = require('../../../models/bicicleta');
var server = require('../../../bin/www');
var mongoose = require('mongoose');

const baseUrl = 'http://localhost:3000/api/bicicletas';
/* beforeEach(() => {
    Bicicleta.allBicis.length = [];
}); */

const aBici = { id: 5, color: "Morada", modelo: "Banana", latitud: -35, longitud: -35 };
const headers = { 'content-type': 'application/json' };

describe("Bicicleta API", () => {
    beforeAll(done => {
        var mongoDB = 'mongodb+srv://ingvictormlnunez:Manolo842703*@cluster0.qskup.mongodb.net/test';
        mongoose.connect(mongoDB, { useNewUrlParser: true })
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB Connection Error: '));
        db.once('open', () => {
            console.log("Connected to red_bicicletas db");
            done();
        })
    });

    afterEach(done => {
        Bicicleta.deleteMany({}, (err, success) => {
            if (err) console.log(err);
            done();
        })
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', done => {
            request.get(baseUrl, function(err, res, body) {
                var result = JSON.parse(body);
                expect(res.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            })
        })
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', done => {
            request.post({
                headers,
                body: JSON.stringify(aBici),
                url: `${baseUrl}/create`
            }, function(err, res, body) {
                expect(res.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe(aBici.color);
                expect(bici.ubicacion[0]).toBe(aBici.latitud);
                expect(bici.ubicacion[1]).toBe(aBici.longitud);
                done();
            });
        })
    });

    describe('POST BICICLETAS /delete', () => {
        it('Status 200', done => {
            Bicicleta.add(aBici, function() {
                request.delete({
                    headers,
                    body: JSON.stringify({ id: aBici.id }),
                    url: `${baseUrl}/delete`
                }, function(err, res, body) {
                    expect(res.statusCode).toBe(204);
                    Bicicleta.findByCode(aBici.id, (err, target) => {
                        expect(!target).toBe(true);
                        done();
                    })
                });
            });
        })
    });
});