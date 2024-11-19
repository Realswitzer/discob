import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function checkUsername(username: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT Username FROM discob.accounts WHERE Username=?",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    if (res.length && username.length <= 20) {
        return true;
    } else {
        return false;
    }
}
