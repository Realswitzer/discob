import { Server, Socket } from "socket.io";
import { MessageData, Events } from "../types";

export const initializeSocketEvents = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        socket.on(Events.Message, (data: MessageData) => {
            data.text = data.text.substring(0, 1000);
            data.timestamp = new Date();
            socket.broadcast.emit(Events.Message, data);
        });
    });
};
