import * as argon2 from "argon2";
import * as mariadb from "mariadb";
import { DatabaseMessage } from "../../types";
import { generateToken } from "../utility/generateToken";
import { pool } from "./pool";
import { sendVerificationEmail } from "../mail/sendVerificationEmail";

export async function createAccount(
    username: string,
    password: string,
    email: string
) {
    //TODO encrypt tokens and emails, stored in plaintext rn bc im too lazy
    const passwordHash = await argon2.hash(password);
    const verificationCode = generateToken(6);
    const verificationCodeHash = await argon2.hash(verificationCode);
    const token = generateToken(100);
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        const data: DatabaseMessage[] = await conn.query(
            "INSERT INTO discob.accounts (Username, PasswordHash, Email, IsVerified, ExpirationDate, VerificationCode, AccountToken) VALUES (?, ?, ?, ?, ADDTIME(NOW(), 500), ?, ?);",
            [username, passwordHash, email, false, verificationCodeHash, token]
        );

        await sendVerificationEmail(email, verificationCode);

        return data;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}
