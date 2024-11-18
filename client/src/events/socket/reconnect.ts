import { socket } from "./socketUtil.ts";
import { NotificationMessage } from "../../lib/classes/notification.js";
import { Status } from "../../types.js";

socket.on("reconnect", () => {
  new NotificationMessage()
    .setType(Status.Error)
    .setMessage("test")
    .append()
})
