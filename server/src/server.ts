import { Server } from "socket.io";
import app from "./app";
import http from "http";
import { CronJob } from "cron";
import { deleteExpiredAccounts } from "./utils/db/deleteExpiredAccounts";
import { initializeSocketEvents } from "./events/initializeSocket";
import "dotenv/config";
import { config } from "../config";

const PORT: number = config.PORT;

const server = http.createServer(app);
export const io = new Server(server, {
    connectionStateRecovery: {},
});

initializeSocketEvents(io);

new CronJob("*/5 * * * *", async () => {
    await deleteExpiredAccounts();
}).start();

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
