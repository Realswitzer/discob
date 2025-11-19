import dotenv from 'dotenv';
dotenv.config();
export const config = {
    enableMail: process.env.ENABLE_MAIL === 'true', 
    enableVerification: process.env.ENABLE_VERIFICATION === 'true',
    PORT: parseInt(process.env.PORT) || 3000
};