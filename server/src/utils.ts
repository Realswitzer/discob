import * as mariadb from "mariadb";
import * as argon2 from "argon2";
import * as nodemailer from "nodemailer";
import {
    DatabaseMessage,
    EmailRegex,
    StatusMessage,
    UsernameRegex,
} from "./types";

const pool = mariadb.createPool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

let transporter = nodemailer.createTransport({
    service: "postfix",
    host: "localhost",
    secure: false,
    port: 25,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    tls: { rejectUnauthorized: false },
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

export async function createAccount(
    username: string,
    password: string,
    email: string
) {
    const passwordHash = await argon2.hash(password);
    const verificationCode = generateCode(6);
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        const data: DatabaseMessage[] = await conn.query(
            "INSERT INTO discob.accounts (Username, PasswordHash, Email, IsVerified, ExpirationDate, VerificationCode) VALUES (?, ?, ?, ?, ADDTIME(NOW(), 500), ?);",
            [username, passwordHash, email, false, verificationCode]
        );

        await sendVerificationEmail(email, verificationCode);

        return data;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export async function checkAccountData(
    username: string,
    email: string
): Promise<[boolean, string]> {
    const usernameExists = await checkUsername(username);
    const emailExists = await checkEmail(email);
    const isUsernameValid = UsernameRegex.test(username);
    const isEmailValid = !EmailRegex.test(email);

    if (usernameExists) {
        return [false, StatusMessage.UsernameTaken];
    }
    if (emailExists) {
        return [false, StatusMessage.EmailTaken];
    }
    if (isUsernameValid) {
        return [false, StatusMessage.InvalidUsername];
    }
    if (isEmailValid) {
        return [false, StatusMessage.InvalidEmail];
    }
    return [true, ""];
}

export async function checkUsername(username: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT Username FROM discob.accounts WHERE Username=?",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    if (res.length) {
        return true;
    } else {
        return false;
    }
}

export async function checkEmail(email: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT Email FROM discob.accounts WHERE Email=?",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    if (res.length) {
        return true;
    } else {
        return false;
    }
}

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

export async function sendVerificationEmail(email: string, code: string) {
    transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "Discob verification code",
        text: `Your verification code is: ${code}`,
    });
}

function generateCode(length: number): string {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}

export async function getVerificationCode(email: string): Promise<string> {
    let conn: mariadb.PoolConnection;
    let res = [{ VerificationCode: "" }];
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT VerificationCode FROM discob.accounts WHERE Email=?",
            [email]
        );
        console.log(res);
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
    return res[0].VerificationCode;
}

export async function checkVerification(
    email: string,
    code: string
): Promise<[boolean, string]> {
    const correctCode = await getVerificationCode(email);
    if (code === correctCode) {
        return [true, StatusMessage.AccountVerified];
    } else {
        return [false, StatusMessage.IncorrectCode];
    }
}

export async function verifyAccount(email: string) {
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        await conn.query(
            "UPDATE LOW_PRIORITY discob.accounts SET IsVerified=1 WHERE Email=?;",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export function sanitize(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
