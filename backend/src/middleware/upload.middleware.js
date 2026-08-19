import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fixly", // specify the folder in Cloudinary where files will be stored
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

export default upload;

// this is multer middleware for handling file uploads to cloudinary. It uses CloudinaryStorage to store files in a specified folder on Cloudinary. The allowed formats for uploaded files are jpg, png, jpeg, and webp. files are not stored locally on the server, but directly uploaded to cloudinary.
