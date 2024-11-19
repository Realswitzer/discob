import { Request, Response } from "express";
import { StatusMessage, UserData } from "../types";
import { checkVerification } from "../utils/account/checkVerification";
import { verifyAccount } from "../utils/db/verifyAccount";
import path from "path";

export async function verify(
    req: Request<{}, {}, { email: string; code: string }>,
    res: Response
) {
    const { email, code } = req.body;
    if (!email || !code) {
        res.send({
            error: StatusMessage.Default,
        });
    }
    const [success, message] = await checkVerification(email, code);
    if (success) {
        verifyAccount(email).then((userData: UserData) => {
            res.send({
                success: message,
                userData: userData,
            });
        });
    } else {
        res.send({
            error: message,
        });
    }
}

export function sendFile(req: Request, res: Response) {
    res.sendFile(
        path.resolve(__dirname + "/../../client/build/verification.html")
    );
}
