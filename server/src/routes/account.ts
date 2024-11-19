import { Router } from "express";
import { sendFile } from "../controllers/account";

const accountRouter = Router();

accountRouter.get("/", sendFile);

export default accountRouter;
