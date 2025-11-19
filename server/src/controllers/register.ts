import { Request, Response } from "express";
import { checkAccountData } from "../utils/db/checkAccountData";
import { createAccount } from "../utils/db/createAccount";

export async function register(
    req: Request<{}, {}, { username: string; password: string; email: string }>,
    res: Response
) {
    const { username, password, email } = req.body;
    checkAccountData(username, email)
        .then((response) => {
            const [isValid, message] = response;
            if (isValid) {
                createAccount(username, password, email)
                    .then(() => {
                        res.send({
                            email: email,
                        });
                    })
                    .catch((err) => {
                        res.send({
                            error: err,
                        });
                    });
            } else {
                res.send({
                    error: message,
                });
            }
        })
        .catch((err) => {
            res.send({
                error: err,
            });
        });
}
