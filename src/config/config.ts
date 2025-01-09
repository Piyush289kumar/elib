import { config as conf } from "dotenv";

conf();

const _config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
