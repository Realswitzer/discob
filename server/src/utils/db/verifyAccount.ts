import * as mariadb from "mariadb";
import { UserData } from "../../types";
import { pool } from "./pool";

export async function verifyAccount(email: string): Promise<UserData> {
    let conn: mariadb.PoolConnection;
    let res: {
        AccountToken: string;
        Username: string;
    };
    try {
        conn = await pool.getConnection();
        await conn.query(
            "UPDATE LOW_PRIORITY discob.accounts SET IsVerified=1 WHERE Email=?;",
            [email]
        );
        res = await conn.query(
            "SELECT AccountToken, Username FROM discob.accounts WHERE Email=?;",
            [email]
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
