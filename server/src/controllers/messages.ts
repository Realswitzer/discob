import { Request, Response } from "express";
import { getMessages as getDatabaseMessages } from "../utils/db/getMessages";

export async function getMessages(
    req: Request<{ room: string; count: string; offset: string }>,
    res: Response
) {
    const { room, offset, count } = req.params;
    getDatabaseMessages(room, Number(count), Number(offset)).then((data) => {
        res.send(data);
    });
}
