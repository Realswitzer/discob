import { Router } from "express";
import { register } from "../controllers/register";

const registerRouter = Router();

registerRouter.post("/", register);

export default registerRouter;
