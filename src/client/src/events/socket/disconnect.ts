import { Events, StatusMessage } from "@backend/types"
import { socket } from "./socketUtil"
import { Status } from "../../types";
import { NotificationMessage } from "../../lib/notification";

socket.on(Events.Disconnect, () => {
    new NotificationMessage()
            .setMessage(StatusMessage.SocketDisconnected)
            .setType(Status.Error)
            .append();
})