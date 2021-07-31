//este archivo sirve para almacenar todas las rutas principales de la aplicacion

const express = require('express'); //requerimos express para usar su metodo router
const router = express.Router();

//definimos las rutas
router.get('/', (req, res) => {
    res.render('partials/index');
})



module.exports = router; // exportamos el modulo de rutas