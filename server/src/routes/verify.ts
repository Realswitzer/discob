import { Router } from "express";
import { verify, sendFile } from "../controllers/verify";

const verifyRouter = Router();

verifyRouter.post("/", verify);
verifyRouter.get("/", sendFile);

export default verifyRouter;
