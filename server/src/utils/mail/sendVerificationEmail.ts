import { transporter } from "./transporter";

export async function sendVerificationEmail(email: string, code: string) {
    transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "Discob verification code",
        text: `Your verification code is: ${code}`,
    });
}
