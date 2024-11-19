import { Router } from "express";
import { getMessages } from "../controllers/messages";

const messagesRouter = Router();

messagesRouter.get("/:room/:offset/:count", getMessages);

export default messagesRouter;
