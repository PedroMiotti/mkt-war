"use strict";
var _a;
// MySQL
const mysql = require("mysql");
//Dotenv
require("dotenv").config();
module.exports = (_a = class SqlPool {
    },
    _a.pool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWD,
        database: process.env.DB_NAME,
    }),
    _a);
//# sourceMappingURL=mysql-connection.js.map