import { Request, Response } from "express";
import { StatusMessage, UserData } from "../types";
import { authenticateUser } from "../utils/account/authenticate";
import { getAccountData } from "../utils/db/sendAccountData";

export async function login(
    req: Request<{}, {}, { username: string; password: string }>,
    res: Response
) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send({
            error: StatusMessage.Default,
        });
    }
    const [success, message] = await authenticateUser(username, password);
    if (success) {
        getAccountData(username).then((userData: UserData) => {
            res.send({
                userData: userData,
            });
        });
    } else {
        res.send({
            error: message,
        });
    }
}
