import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
import { CourseContent } from "../models/course.models.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


export const uploadVideoToCloudinary = async (filePath, metaData) => {
  try {
    const { title, courseId, instructorId } = metaData;
    const result = await cloudinary.uploader.upload(filePath.path, {
      resource_type: "video",
    }).then(async (response) => {
      console.log("videoUrl:", response.secure_url)
      const updateResult = await CourseContent.updateOne(
        { courseId: courseId, "content.title": { $ne: title } }, // Only add if same title doesn't exist
        {
          $push: {
            content: {
              title: title,
              videoUrl: [{ url: response.secure_url }],
              status: "success",
            },
          },
          $set: {
            instructorId: instructorId,
          },
        }
      );

      if (updateResult.matchedCount === 0) {
        await CourseContent.create({
          courseId: courseId,
          instructorId: instructorId,
          isReadyToPublish: false,
          content: [
            {
              title: title,
              videoUrl: [{ url: response.secure_url }],
              status: "success",
            },
          ],
        });
      }

    })
  } catch (error) {
    console.log("video upload error:", error.message)
  }
  return {
    message: "File uploaded successfully",
  };
};






// const uploadFileToBucket = async (file, metaData) => {
//   const { title, courseId, instructorId } = metaData;
//   const fileExt = path.extname(file.originalname);
//   const s3Meta = {
//     title,
//     courseid: String(courseId),
//     instructorId,
//   };
//   const key = `videos/${courseId}/${uuid()}${fileExt}`;

//   await s3Client
//     .send(
//       new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key,
//         Body: createReadStream(file.path),
//         ContentType: "video/mp4",
//         Metadata: s3Meta,
//       })
//     )
//     .then(async () => {
//       const updateResult = await CourseContent.updateOne(
//         { courseId: courseId, "content.title": { $ne: title } }, // Only add if same title doesn't exist
//         {
//           $push: {
//             content: {
//               title: title,
//               videoUrl: [{ url: `https://dli9sffaoloqh.cloudfront.net/${key}` }],
//               status: "success",
//             },
//           },
//           $set: {
//             instructorId: instructorId,
//           },
//         }
//       );

//       // If no existing course found (matchedCount === 0), create new course
//       if (updateResult.matchedCount === 0) {
//         await CourseContent.create({
//           courseId: courseId,
//           instructorId: instructorId,
//           isReadyToPublish: false,
//           content: [
//             {
//               title: title,
//               videoUrl: [{ url: `https://dli9sffaoloqh.cloudfront.net/${key}` }],
//               status: "success",
//             },
//           ],
//         });
//       }
//     });

//   return {
//     message: "File uploaded successfully",
//     videoUrl: `https://dli9sffaoloqh.cloudfront.net/${key}`,
//   };
// };
