require('dotenv').config();
var bicicletasRouter = require('./routes/bicicletas');
var Usuario = require('./models/usuario');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var indexRouter = require('./routes/index');
var logger = require('morgan');
var path = require('path');
var tokenRouter = require('./routes/token');
var usersRouter = require('./routes/usuarios');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var authAPIRouter = require("./routes/api/auth");
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var jwt = require('jsonwebtoken');
var Token = require('./models/token');

let store;
if (process.env.NODE_ENV === 'development') {
    store = new session.MemoryStore;
} else {
    store = new MongoDBStore({
        uri: process.env.MONGO_URI,
        collection: 'sessions'
    });
    store.on('error', function(error) {
        assert.ifError(error);
        assert.ok(false);
    });
}

var app = express();
var mongoose = require('mongoose');
const { Session } = require('inspector');
mongoose.set('useCreateIndex', true);

app.use(session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 }, //10 dias
    store: store,
    saveUninitialized: true,
    resave: 'true',
    secret: 'red_de_bicicletas_0123456789'
}));

// var mongoDB = 'mongodb://victorml:victorml@127.0.0.1:27017/red_bicicletas?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
//var mongoDB = 'mongodb+srv://ingvictormlnunez:Manolo842703*@cluster0.qskup.mongodb.net/test';
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
/* db.once('open', function() {
    // we're connected!
    console.log('Conectado a mongo data base');
}); */


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('secretKey', 'jwt_pwd_123456789');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', loggedIn, usersRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
//app.use('/api/bicicletas', bicicletasApiRouter);
//app.use('/api/usuario', usuariospiRouter);
app.use('/token', tokenRouter);
//app.use('/usuarios', usuarioRouter);

app.use("/api/auth", authAPIRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', validarUsuario, usuariosAPIRouter);

app.get('/login', (req, res) => {
    res.render('session/login');
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, usuario, info) {
        if (err) return next(err);
        if (!usuario) return res.render('session/login', { info });

        req.logIn(usuario, (err) => {
            if (err) {

                return next(err);
            };
            return res.redirect('/');
        })
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/forgotpassword', (req, res) => {
    res.render('session/forgotPassword');
});

app.post('/forgotpassword', (req, res) => {
    Usuario.findOne({ email: req.body.email }, (err, usuarios) => {
        if (!usuarios)
            return res.render('session/forgotPassword', { info: { message: 'No existe email para un usuario existente' } });

        usuarios.resetPassword(function(err) {
            if (err)
                return next(err);
            console.log('session/forgotPasswordMessage');
        });

        res.render('session/forgotPasswordMessage');
    });
});

app.get('/resetPassword/:token', function(req, res, next) {
    Token.findOne({ token: req.params.token }, function(err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe un usuario asociado al token, Verifique que su token no haya expirado' });

        Usuario.findById(token._userId, function(err, usuario) {
            if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado al token' });
            res.render('session/resetPassword', { errors: {}, usuario: usuario });
        })
    })
});

app.post('/resetPassword', function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        res.render('session/resetPassword', { errors: { message: 'No coincide el password y su confirmación' } });
    }

    Usuario.findOne({ email: req.body.email }, function(err, usuario) {
        usuario.password = req.body.password;
        usuario.save(function(err) {
            if (err) {
                res.render('session/resetPassword', { errors: err.errors, usuario: new Usuario({ email: req.body.email }) });
            } else {
                res.redirect('/login');
            }
        });
    });

});

app.use('/privacy_policy', function(req, res) {
    res.sendFile('public/privacy_policy.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        console.log("Usuario no  logueado");
        res.redirect("/login");
    }
};

function validarUsuario(req, res, next) {
    jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(err, decoded) {
        if (err) {
            console.log("Error en validar usuario");
            res.json({ status: "error", message: err.message, data: null });
        } else {
            req.body.userId = decoded.id;
            console.log("jwt verify:" + decoded);
            next();
        }
    });
}

module.exports = app;