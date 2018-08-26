/**
 * Valiables de entorno
 */

//  ======================================
//   Puerto
//  ======================================
process.env.PORT = process.env.PORT || 3000;

//  ======================================
//   Entorno
//  ======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

//  ======================================
//   Vencimiento del token
//  ======================================
process.env.CADUCIDAD_TOKEN = '30d';

//  ======================================
//   SEED de autenticación
//  ======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//  ======================================
//   Base de datos Mongo
//  ======================================
let urlDB = `mongodb://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@ds125932.mlab.com:25932/cafe-luis`;

if (process.env.NODE_ENV === 'local') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

process.env.URLDB = urlDB;

//  ======================================
//   Google client id
//  ======================================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '974233101349-ufac6cui4bq3625j8743qrmnn2642il5.apps.googleusercontent.com';
