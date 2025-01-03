import { config as conf } from "dotenv";

conf();

const _config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
};

export const config = Object.freeze(_config);
