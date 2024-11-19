import express from "express";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
import verifyRouter from "./routes/verify";
import accountRouter from "./routes/account";
import { StatusMessage } from "./types";
import rateLimit from "express-rate-limit";
import messagesRouter from "./routes/messages";

const app = express();
app.set("trust proxy", 1);

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

app.use(express.json());

app.use(express.static(__dirname + "/../../client/build/"));

app.use("/login", limiter, loginRouter);
app.use("/verify", limiter, verifyRouter);
app.use("/register", limiter, registerRouter);
app.use("/account", accountRouter);
app.use("/messages", messagesRouter);

export default app;
