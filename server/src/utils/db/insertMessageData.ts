import * as mariadb from "mariadb";
import { MessageData } from "../../types";
import { pool } from "./pool";

export async function insertMessageData(data: MessageData) {
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO discob.messages (ID, RoomID, MessageText, MessageDate, Username, UserColor, Reply) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                0,
                "public",
                data.text,
                Number(data.timestamp).toString(),
                data.sender.username,
                data.sender.color,
                JSON.stringify(data.reply),
            ]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}
