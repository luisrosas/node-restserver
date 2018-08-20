/**
 * Valiables de entorno
 */
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB = `mongodb://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@ds125932.mlab.com:25932/cafe-luis`;

if (process.env.NODE_ENV === 'local') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

process.env.URLDB = urlDB;
