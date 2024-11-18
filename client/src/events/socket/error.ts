import { Events, StatusMessage } from "@backend/types";
import { socket } from "./socketUtil";
import { NotificationMessage } from "../../lib/classes/notification";
import { Status } from "../../types";

socket.on(Events.Error, (error) => {
    new NotificationMessage()
        .setType(Status.Error)
        .setMessage(error)
        .append()
})