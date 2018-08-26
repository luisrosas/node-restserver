const jwt = require('jsonwebtoken');

let varificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

let verificaAdminRole = (req, res, next) => {
    console.log(req.usuario.role);
    if (req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no cuenta con los permisos necesarios para realizar esta acción'
            }
        });
    }

    next();
}

module.exports = {
    varificaToken,
    verificaAdminRole
}