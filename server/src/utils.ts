import * as mariadb from "mariadb";
import { DatabaseMessage } from "./types";

const pool = mariadb.createPool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

/**
 * Retrieves messages from the database given count, offset, and roomID
 *
 * @export
 * @param {string} room
 * @param {number} count
 * @param {number} offset
 * @return {*} 
 */
export async function getMessages(room: string, count: number, offset: number) {
    let conn: mariadb.PoolConnection
    try {
        conn = await pool.getConnection();
        const data: DatabaseMessage[] = await conn.query(
            "SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;",
            [room, count, offset]
        );
        return data;
    } catch (err) {
        console.log("Error" + err)
    } finally {
        conn.release()
    }
    
}

export function sanitize(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
