var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/api/usuarioControllerAPI');

// /* GET users listing. */
// /* router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// }); */

router.get('/', usuarioController.usuario_list);
router.get('/create', usuarioController.usuario_create_get);
router.post('/create', usuarioController.usuario_create_post);
router.get('/:email/update', usuarioController.usuario_update_get);
router.post('/:email/update', usuarioController.usuario_update_post);
router.post('/delete/:id', usuarioController.usuario_delete_post);
router.get('/login', usuarioController.login_get);
router.post('/login', usuarioController.login_post);
router.get('/forgotPassword', usuarioController.forgot_password_get);
router.post('/forgotPassword', usuarioController.forgot_password_post);

module.exports = router;