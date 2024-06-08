import dotenv from "dotenv";
import { valueOfEnvOrThrow } from "../utils";
dotenv.config();

export const SOCKET_SERVER_URL = valueOfEnvOrThrow(String(process.env.SOCKET_IO_SERVER_URL));
