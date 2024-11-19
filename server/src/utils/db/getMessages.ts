import { DatabaseMessage } from "../../types";
import * as mariadb from "mariadb";
import { pool } from "./pool";

export async function getMessages(
    room: string,
    count: number,
    offset: number
): Promise<DatabaseMessage[]> {
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        const data: DatabaseMessage[] = await conn.query(
            "SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;",
            [room, count, offset]
        );
        return data;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}
