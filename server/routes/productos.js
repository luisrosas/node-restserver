const express = require('express');
const _ = require('underscore');

const { varificaToken } = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

const app = express();

app.get('/productos', varificaToken, (req, res) => {
// todos los productos paginados
// pupolate: usuario y categoria
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, cantidad) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.status(201).json({
                    ok: true,
                    productos,
                    total: cantidad
                });
            });
        });
});

//Buscar productos
app.get('/productos/buscar', varificaToken, (req, res) => {
    let termino = req.query.q;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron productos con este termino'
                    }
                });
            }

            return res.json({
                ok: true,
                productos
            });
        });
});

app.get('/productos/:id', varificaToken, (req, res) => {
// Obtener un producto
// pupolate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                });
            }

            return res.json({
                ok: true,
                producto
            });
        });
});

app.post('/productos', varificaToken, (req, res) => {
    // crear un producto con usuario y cstegoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto
        });
    });
});

app.put('/productos/:id', varificaToken, (req, res) => {
    // actualizar un producto
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

app.delete('/productos/:id', varificaToken, (req, res) => {
    // cambiar a false el campo disponible
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {disponible: false}, { new: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'EL producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto borrado'
        });
    });
});

module.exports = app;