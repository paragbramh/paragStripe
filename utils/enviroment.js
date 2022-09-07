import { config } from "dotenv";

config();

export const env = {
  CONNECTION_URL: process.env.CONNECTION_URL,
  SECRET_JWT: process.env.SECRET_JWT,
};
