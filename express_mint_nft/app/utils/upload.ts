import cloudinary from "cloudinary";
import ENV from "../env";

cloudinary.v2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default async (file: string) => {
  return await cloudinary.v2.uploader.upload(file, { folder: "images" });
};
