import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function getAccountData(username: string) {
    let conn: mariadb.PoolConnection;
    let res: {
        AccountToken: string;
        Username: string;
    };
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT AccountToken, Username FROM discob.accounts WHERE Username=?;",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return {
        token: res[0]?.AccountToken,
        username: res[0]?.Username,
    };
}
