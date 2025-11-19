import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function deleteExpiredAccounts() {
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        await conn.query(
            "DELETE FROM discob.accounts WHERE IsVerified=0 AND TIMESTAMPDIFF(MINUTE, NOW(), ExpirationDate)<0;"
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}
