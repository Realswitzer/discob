import * as mariadb from "mariadb";
import "dotenv/config";

export const pool = mariadb.createPool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
