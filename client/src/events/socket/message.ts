import { MessageData, Events } from "@backend/types";
import { Message } from "../../lib/message";
import { socket } from "./socketUtil";

socket.on(Events.Message, (data: MessageData) => {
    const date = new Date(data.timestamp);
    new Message()
        .setSender(data.sender.username, data.sender.color)
        .setMessage(data.text)
        .setTimestamp(date)
        .append();
});
