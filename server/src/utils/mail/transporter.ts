import * as nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
    service: "postfix",
    host: "localhost",
    secure: false,
    port: 25,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    tls: { rejectUnauthorized: false },
});
