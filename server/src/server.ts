import { Server } from "socket.io";
import app from "./app";
import http from "http";
import { initializeSocketEvents } from "./events/initializeSocket";
import "dotenv/config";
import { config } from "../config";

const PORT: number = config.PORT;

const server = http.createServer(app);
export const io = new Server(server, {
    connectionStateRecovery: {},
});

initializeSocketEvents(io);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
