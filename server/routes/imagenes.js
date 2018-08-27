const express = require('express');
const app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let image = path.resolve(__dirname, '../assets/no-image.jpg');

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        image = pathImagen;
    }

    res.sendFile(image);
});

module.exports = app;
