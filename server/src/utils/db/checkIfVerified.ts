import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function checkIfVerified(email: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT IsVerified FROM discob.accounts WHERE Email=? && IsVerified=0;",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return !res.length;
}
