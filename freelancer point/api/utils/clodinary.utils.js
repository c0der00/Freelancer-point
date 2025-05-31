import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) => {
    try {
        if (!localpath) {
            console.log("No file path provided");
            return null;
        }

        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
        });

        console.log("File uploaded to Cloudinary", response.url);
        return response;

    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        try {
            fs.unlinkSync(localpath);
            console.log("Local file deleted after failed upload");
        } catch (unlinkError) {
            console.error("Error deleting local file:", unlinkError);
        }

        return null;
    }
};

export { uploadOnCloudinary };
