import * as mariadb from "mariadb"

const pool = mariadb.createPool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

export async function getMessages(room: string, count: number, offset: number) {
  const conn = await pool.getConnection()
  const data = await conn.query("SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;", [room, count, offset])
  conn.release()
  //TODO: catch errors
  return data
}

export enum Events {
  Message = "message",
}
