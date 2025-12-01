import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    console.log("Cloudinary upload result:", result);

    const optimizeUrl = cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    const autoCropUrl = cloudinary.url(result.public_id, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });
    const thumbnailCropUrl = cloudinary.url(result.public_id, {
      crop: "auto",
      gravity: "auto",
      width: 1280,
      height: 720,
    });

    console.log("Optimized URL:", optimizeUrl);
    console.log("Auto-cropped URL:", autoCropUrl);

    return {
      url: result.secure_url,
      optimizedUrl: optimizeUrl,
      autoCropUrl: autoCropUrl,
      thumbnailCropUrl: thumbnailCropUrl,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Cloudinary upload failed");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Cloudinary delete failed");
  }
};

export  {uploadToCloudinary,deleteFromCloudinary};
