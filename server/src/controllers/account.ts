import { Request, Response } from "express";
import path from "path";

export async function sendFile(req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname + "/../../client/build/login.html"));
}
