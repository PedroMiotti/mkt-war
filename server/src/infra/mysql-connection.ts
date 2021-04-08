// MySQL
import mysql = require("mysql");
//Dotenv
require("dotenv").config();

// MySQl
export = class SqlPool {
	public static readonly pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
  });
}
