const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

sql.connect(config).then(() => {
    console.log('Connected!');
    process.exit(0);
}).catch(err => {
    console.error('Connection failed:', err);
});
