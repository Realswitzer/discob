import express, { Request, response, Response } from "express";
import { rateLimit } from "express-rate-limit";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import {
    checkAccountData,
    deleteExpiredAccounts,
    getMessages,
    createAccount,
    checkVerification,
    verifyAccount,
    authenticateUser,
    getAccountData,
} from "./utils";
import { initializeSocketEvents } from "./events/initializeSocket";
import { CronJob } from "cron";
import { StatusMessage, UserData } from "./types";

const limiter = rateLimit({
    windowMs: 1000 * 60,
    limit: 10,
    validate: {
        trustProxy: true,
    },
    handler: function (req, res) {
        res.send({
            error: StatusMessage.ExceededRateLimit,
        });
    },
});

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);
export const io = new Server(server, {
    connectionStateRecovery: {},
});

new CronJob("*/5 * * * *", async () => {
    await deleteExpiredAccounts();
}).start();

initializeSocketEvents(io);

app.use(express.json());
app.use(express.static(__dirname + "/../../client/build/"));

app.get("/messages/:room/:offset/:count", (req: Request, res: Response) => {
    const { room, offset, count } = req.params;
    getMessages(room, Number(count), Number(offset)).then((data) => {
        res.send(data);
    });
});

app.get("/account", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + "/../../client/build/login.html"));
});

app.get("/verification", (req: Request, res: Response) => {
    res.sendFile(
        path.resolve(__dirname + "/../../client/build/verification.html")
    );
});

app.post(
    "/register",
    limiter,
    (
        req: Request<
            {},
            {},
            { username: string; password: string; email: string }
        >,
        res: Response
    ) => {
        //TODO make handler functions instead of putting everything in index.ts
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
);

app.post(
    "/verify",
    limiter,
    async (
        req: Request<{}, {}, { email: string; code: string }>,
        res: Response
    ) => {
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
);

app.post(
    "/login",
    limiter,
    async (
        req: Request<{}, {}, { username: string; password: string }>,
        res: Response
    ) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.send({
                error: StatusMessage.Default,
            });
        }
        const [success, message] = await authenticateUser(username, password)
        if (success) {
            getAccountData(username).then((userData: UserData) => {
                res.send({
                    userData: userData
                })
            })
        } else {
            res.send({
                error: message
            })
        }
    }
);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
