import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function getVerificationCode(email: string): Promise<string> {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT VerificationCode FROM discob.accounts WHERE Email=?",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    return res[0].VerificationCode;
}
