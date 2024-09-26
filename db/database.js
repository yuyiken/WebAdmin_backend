require('dotenv').config();
const { createPool } = require("mysql2/promise");

const database = {
    connectionLimit: 10,
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "bans",
    port: process.env.DATABASE_PORT || 3306,
};

const pool = createPool(database);
module.exports = { pool };