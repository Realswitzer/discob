import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function getAccountPassword(username: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT PasswordHash FROM discob.accounts WHERE Username=?",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return res[0]?.PasswordHash;
}
