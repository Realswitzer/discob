import * as argon2 from "argon2";
import * as mariadb from "mariadb";
import { UserData } from "../../types";
import { generateToken } from "../utility/generateToken";
import { pool } from "./pool";

export async function createAccount(
    username: string,
    password: string
): Promise<UserData | undefined> {
    const passwordHash = await argon2.hash(password);
    const token = generateToken(100);
    let conn: mariadb.PoolConnection | undefined;
    try {
        conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO discob.accounts (Username, PasswordHash, AccountToken) VALUES (?, ?, ?);",
            [username, passwordHash, token]
        );

        return {
            username,
            token,
        };
    } catch (err) {
        console.log(err);
    } finally {
        conn?.release();
    }
}
