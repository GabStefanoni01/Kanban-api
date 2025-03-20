require('dotenv').config();
const mysql = require('mysql2');

// Conexão com o MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Testa a conexão
db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco:', err.message);
        return;
    }
    console.log('✅ Conectado ao MySQL com sucesso!');
});

module.exports = db;
