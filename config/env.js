import { config } from "dotenv";

config({ path: ".env" });

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    FRONTEND_URL
} = process.env;