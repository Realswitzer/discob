import * as mariadb from "mariadb";
import * as argon2 from "argon2";
import * as nodemailer from "nodemailer";
import {
    DatabaseMessage,
    EmailRegex,
    MessageData,
    StatusMessage,
    UserData,
    UsernameRegex,
} from "./types";

//TODO split functions into multiple files

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
    if (res.length && username.length <= 20) {
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
    if (res.length && email.length <= 255) {
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

function generateToken(length: number): string {
    let token = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        token += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return token;
}

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

export async function checkVerification(
    email: string,
    code: string
): Promise<[boolean, string]> {
    const isAlreadyVerified = await checkIfVerified(email);
    const correctCode = await getVerificationCode(email);
    if (isAlreadyVerified) {
        return [false, StatusMessage.AccountAlreadyVerified];
    }
    if (await argon2.verify(correctCode, code)) {
        return [true, StatusMessage.AccountVerified];
    }
    return [false, StatusMessage.IncorrectCode];
}

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

export async function checkIfVerified(email: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT IsVerified FROM discob.accounts WHERE Email=? && IsVerified=0;",
            [email]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return !res.length;
}

export async function getAccountPassword(username: string) {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT PasswordHash FROM discob.accounts WHERE Username=?",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return res[0]?.PasswordHash;
}

export async function authenticateUser(username: string, password: string): Promise<[boolean, string]> {
    const passwordHash = await getAccountPassword(username)
    if (!passwordHash) {
        return [false, StatusMessage.AccountNotFound]
    }
    if (!await argon2.verify(passwordHash, password)) {
        return [false, StatusMessage.IncorrectPassword]
    }
    return [true, ""]
}

export async function insertMessageData(data: MessageData) {
    let conn: mariadb.PoolConnection;
    try {
        conn = await pool.getConnection();
        await conn
        .query(
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
        )

    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export async function isTokenValid(
    username: string,
    token: string
): Promise<boolean> {
    let conn: mariadb.PoolConnection;
    let res: any;
    try {
        conn = await pool.getConnection();
        res = await conn.query(
            "SELECT AccountToken FROM discob.accounts WHERE Username=?;",
            [username]
        );
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }

    return res[0]?.AccountToken === token;
}

export function sanitize(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
