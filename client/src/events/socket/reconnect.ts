import { socket } from "./socketUtil";
import { NotificationMessage } from "../../lib/notification";
import { Status } from "../../types";

socket.on("reconnect", () => {
  new NotificationMessage()
    .setType(Status.Error)
    .setMessage("test")
    .append()
})
