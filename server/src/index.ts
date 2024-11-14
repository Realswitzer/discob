import express, { Request, Response, Application } from "express";
import { Server as SocketIO } from "socket.io";
import "dotenv/config";
import { Events, getMessages } from "./utils";

const PORT = process.env.PORT;

const app: Application = express();
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
const io = new SocketIO(server);

app.use(express.static(__dirname + "/../../client/build/"));

app.get("/messages/:room/:offset/:count", (req: Request, res: Response) => {
    const { room, offset, count } = req.params;
    getMessages(room, Number(offset), Number(count)).then((data) => {
        res.send(data);
    });
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/../../client/build/index.html");
});

//io.on("connection", (socket) => {
//  socket.on(Events.Message, () => {
//
//  })
//})
