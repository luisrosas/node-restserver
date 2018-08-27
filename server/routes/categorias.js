const express = require('express');

const { varificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');

const app = express();

// Mostrar todas las categorias
app.get('/categorias', varificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') // Ordena la salida
        .populate('usuario', 'nombre email') // Obtine los datos del usuario
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categorias
            });
        });
});

// mostrar una categoria por id
app.get('/categorias/:id', varificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria
        });
    });
});

// crear una categoria 
app.post('/categorias', varificaToken, (req, res) => {
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// editar una categoria por id
app.put('/categorias/:id', varificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, { descripcion: req.body.descripcion }, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

// eliminar una categoria por id
app.delete('/categorias/:id', [varificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

module.exports = app;