var mongoose = require('mongoose');
var bicicleta = require('../../models/bicicleta');
var timeJasmine = jasmine.DEFAULT_TIMEOUT_INTERVA;
var urlMongo = 'mongodb: //localhost:27017/red_bicicletas';

describe('Testing Bicicletas', function() {
    beforeEach(function(done) {
        // var mongoDB = 'mongodb://victorml:victorml@127.0.0.1:27017/bicicleta?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
        var mongoDB = 'mongodb+srv://ingvictormlnunez:Manolo842703*@cluster0.qskup.mongodb.net/test';
        mongoose.set('useCreateIndex', true);
        mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('Conectado a mongoDB test database bicicletas');
        });
        timeJasmine = 10000;
        done();
    });

    afterEach(function(done) {
        bicicleta.deleteMany({}, function(err, success) {
            if (err) console.log(err);

        });
        jasmine.DEFAULT_TIMEOUT_INTERVA = timeJasmine;
        timeJasmine = 10000;
        done();
    });

    describe('Bicicleta.createInstancia', () => {
        it('crea una instancia de Bicicleta', (done) => {
            var bici = bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
            done();

        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);
            });
            done();
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            bicicleta.add(aBici, function(err, newBici) {
                if (err) console.log(err);
                bicicleta.allBicis(function(err, urlMongo) {
                    expect(urlMongo.length).toEqual(0);
                    expect(1).toEqual(aBici.code);

                });
            });
            done();
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);

                var aBici = new bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                bicicleta.add(aBici, function(err, newBici) {
                    if (err) console.log(err);

                    var aBici2 = new bicicleta({ code: 2, color: "roja", modelo: "urbana" });
                    bicicleta.add(aBici2, function(err, newBici) {
                        if (err) console.log(err);
                        bicicleta.findByCode(1, function(error, urlMongo) {
                            expect(urlMongo.code).toBe(aBici.code);
                            expect(urlMongo.color).toBe(aBici.color);
                            expect(urlMongo.modelo).toBe(aBici.modelo);
                        });
                    });
                });
            });
            done();
        });
    });

    describe('Bicicleta.removeByCode', () => {
        it('debe eliminar la bici con code 1', (done) => {
            bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(2);

                var aBici = new bicicleta({ code: 1, color: "verde", modelo: "urbana" });
                bicicleta.add(aBici, function(err, newBici) {
                    if (err) console.log(err);

                    expect(bicis.length).toBe(2);
                });

                bicicleta.removeByCode(aBici[1], function(error, urlMongo) {
                    expect(urlMongo.code).toBe();
                });
            });

            done();
        });
    });
});


/* beforeEach(() => {
    bicicleta.allBicis = [];
});

beforeEach(() => {
    console.log('testeando');
});
 */

/* describe('testeando...', () => {
    var test = console.log('testeando...');
    it('testeando...', () => {
        expect(test);
    });
});

describe('bicicletas.allBicis', () => {
    it('Comienza vacia', () => {
        expect(bicicleta.allBicis.length).toBe[0];
    });
});

describe('bicletas.add', () => {
    it('agrega una bicicleta', () => {
        expect(bicicleta.allBicis.length).toBe[0];

        var c = new bicicleta(3, 'blanca', 'urbana', [10.226569, -83.903271]);
        bicicleta.add(c);

        expect(bicicleta.allBicis.length).toBe[1];
        expect(bicicleta.add(c));

    });
});

describe('bicicletas.findById', () => {
    it('debe devolver bici con id=1', () => {
        expect(bicicleta.allBicis.length).toBe[0];
        var aBici = new bicicleta(1, "Cafe", "enduro");
        var aBici1 = new bicicleta(2, "turquesa", "banana");
        bicicleta.add(aBici);
        bicicleta.add(aBici1);

        var targetBici = bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    })
});

describe('bicicletas.removeById', () => {
    it('debe eleminar bici con id=1', () => {
        expect(bicicleta.allBicis.length).toBe[0];
        var aBici = new bicicleta(1, "dorada", "chooper");
        bicicleta.add(aBici);

        expect(bicicleta.allBicis.length).toBe[1];
        bicicleta.removeById(1);
        expect(bicicleta.allBicis.length).toBe[0];
    })
}) */