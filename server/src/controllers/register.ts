import { Request, Response } from "express";
import { StatusMessage } from "../types";
import { checkAccountData } from "../utils/db/checkAccountData";
import { createAccount } from "../utils/db/createAccount";

export async function register(
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send({
            error: StatusMessage.EnterInformation,
        });
        return;
    }

    try {
        const [isValid, message] = await checkAccountData(username);
        if (!isValid) {
            res.send({
                error: message,
            });
            return;
        }

        const userData = await createAccount(username, password);
        if (!userData) {
            res.send({
                error: StatusMessage.Default,
            });
            return;
        }
        res.send({
            userData,
        });
    } catch (err) {
        res.send({
            error: StatusMessage.Default,
        });
    }
}
