const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { varificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuarios', varificaToken, (req, res) => {
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({estado: true}, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({estado: true}, (err, cantidad) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.status(201).json({
                    ok: true,
                    usuario: usuarios,
                    total: cantidad
                });
            });
        });
});

app.get('/usuarios/:id', varificaToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id, 'nombre email role estado google', (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario
        });
    });
});

app.post('/usuarios', [varificaToken, verificaAdminRole], function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuarios/:id', [varificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    console.log(id, req);
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuarios/:id', [varificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, {new:true}, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;