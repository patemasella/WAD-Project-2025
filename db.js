const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., localhost
    port: parseInt(process.env.DB_PORT) || 1433, // Make sure this matches your SQL Server
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,       // true if using Azure
        enableArithAbort: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to MSSQL database!');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

module.exports = { sql, connectDB };
