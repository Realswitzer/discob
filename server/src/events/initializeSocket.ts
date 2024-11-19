import { Server, Socket } from "socket.io";
import { MessageData, Events, StatusMessage } from "../types";
import { sanitize } from "../utils/utility/sanitize";
import { isTokenValid } from "../utils/db/checkTokenValidity";
import { insertMessageData } from "../utils/db/insertMessageData";

export const initializeSocketEvents = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        //TODO make this less messt
        socket.on(Events.Message, async (data: MessageData) => {
            data.text = sanitize(data.text.substring(0, 1000));
            data.timestamp = new Date();

            if (await isTokenValid(data.sender.username, data.token)) {
                socket.broadcast.emit(Events.Message, data);
                await insertMessageData(data);
            } else {
                socket.emit(Events.Error, StatusMessage.MessageFailed);
            }
        });
    });
};
