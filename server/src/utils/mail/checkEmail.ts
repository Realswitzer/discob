import * as mariadb from "mariadb";
import { pool } from "../db/pool";

export async function checkEmail(email: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT Email FROM discob.accounts WHERE Email=?",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    if (res.length && email.length <= 255) {
        return true;
    } else {
        return false;
    }
}
