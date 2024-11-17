import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { getMessages } from "./utils";
import { initializeSocketEvents } from "./events/initializeSocket";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    connectionStateRecovery: {},
});

initializeSocketEvents(io);

app.use(express.static(__dirname + "/../../client/build/"));

app.get("/messages/:room/:offset/:count", (req: Request, res: Response) => {
    const { room, offset, count } = req.params;
    getMessages(room, Number(count), Number(offset)).then((data) => {
        res.send(data);
    });
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/../../client/build/index.html");
});

app.get("/account", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/../../client/build/login.html");
});

app.post(
    "/register",
    (
        req: Request<{}, {}, { username: string; password: string }>,
        res: Response
    ) => {
        const { username, password } = req.body;
    }
);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
