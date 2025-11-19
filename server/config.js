import dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT: parseInt(process.env.PORT) || 3000,
};
