import generateUuid from "../utils/generateUuid.utils.js";
import { pool } from "../db/sql.db.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinary.service.js";
import { CourseContent } from "../models/course.models.js";
import { uploadVideoToCloudinary } from "../services/UploadVideoToS3.service.js";
import { notifyQueue } from "../queues/notifyQueue.js"

const registerInstructorDetails = async (req, res) => {
  try {
    const { about, experience } = req.body;
    const userId = req.user.id;

    console.log("userId:", userId);

    try {
      const updateInstructor = await pool.query(
        `UPDATE INSTRUCTOR SET ABOUT = $1, EXPERIENCE = $2, PROFILE_STATUS = $3 WHERE ID = $4 RETURNING *;`,
        [about, experience, true, userId]
      );

      return res.status(200).json({
        message: "registered success",
        user: updateInstructor.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const { id } = req.user;
    const thumbnail = req.files?.thumbnail?.[0].path;

    console.log("thumbnail:", thumbnail);
    console.log("title:", title);
    console.log("description:", description);
    console.log("price:", price);
    console.log("instructorId:", id);

    if (!title || !description || !price || !thumbnail) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }
    const courseId = generateUuid();

    const { thumbnailCropUrl, publicId } = await uploadToCloudinary(thumbnail);

    try {
      const course = await pool.query(
        `INSERT INTO COURSES (ID,TITLE,DESCRIPTION,THUMBNAIL,PRICE,INSTRUCTOR_ID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
        [courseId, title, description, thumbnailCropUrl, price, id]
      );
      return res.status(200).json({
        message: "Course created successfully!",
        course: course.rows[0],
      });
    } catch (error) {
      await deleteFromCloudinary(publicId);
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const courseTags = async (req, res) => {
  try {
    const { tags, courseId } = req.body;
    console.log(courseId, tags);
    if (!courseId || !tags) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const result = tags.map(
      async (tag) =>
        await pool.query(
          `INSERT INTO COURSES_TAGS (ID,COURSE_ID,TAGS) VALUES ($1,$2,$3);`,
          [generateUuid(), courseId, tag]
        )
    );
    await Promise.all(result);
    console.log("result:", result);

    if (result.length === 0) {
      return res.status(400).json({
        message: "Failed to add course tags.",
      });
    }

    return res.status(200).json({
      message: "Course tags added successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong in tags!",
      error: error.message,
    });
  }
};

const uploadCourseContent = async (req, res) => {
  try {
    const { courseId } = req.body;
    let { title } = req.body;
    const videoFiles = req.files?.videos;

    if (!title || !videoFiles || videoFiles.length === 0) {
      return res.status(400).json({
        message: "Title, serialNo, and at least one video are required.",
      });
    }

    if (typeof title === "string") {
      title = [title];
    }

    const uploadedVideos = await Promise.all(
      videoFiles.map((video, index) =>
        uploadVideoToCloudinary(video, {
          title: title[index],
          instructorId: req.user.id,
          courseId: courseId,
        })
      )
    )

    if (uploadedVideos.length === 0) {
      return res.status(400).json({
        message: "Failed to upload videos.",
      });
    }
    console.log("uploadedVideos:", uploadedVideos);

    return res.status(200).json({
      message: `${videoFiles.length} video(s) uploaded and processing.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while uploading videos.",
      error: error.message,
    });
  }
};

const publishedCourse = async (req, res) => {
  try {
    const { id } = req.user;

    const published = await pool.query(
      `select id,title,description,thumbnail,price,created_date,is_published ,instructor_id FROM COURSES where instructor_id=$1 and is_published=$2`,
      [id, true]
    );
    if (published.rows.length === 0) {
      return res.status(200).json({
        message: "empty",
        courses: [],
      });
    } else if (published.rows.length > 1) {
      console.log("published.rows:", published.rows);
      return res.status(200).json({
        courses: published.rows,
      });
    }

    return res.status(200).json({
      courses: published.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};



const draftedCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId:", userId);
    let draftCourses = [];
    const draftCourse = await pool.query(
      `SELECT id, title, thumbnail, description, instructor_id FROM courses WHERE instructor_id = $1 and is_published = $2`,
      [userId, false]
    );
    if (draftCourse.rows.length === 0) {
      return res.status(200).json({
        message: "empty course",
        course: [],
      });
    }
    if (draftCourse.rows.length > 0) {
      draftCourses = draftCourse.rows.map((course) => course);
      return res.status(200).json({
        courses: draftCourses,
      });
    }

    return res.status(200).json({
      course: [draftCourse.rows[0]],
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};



const getDraftedCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    console.log(req.user.id);

    const course = await pool.query(
      `SELECT * FROM COURSES WHERE ID = $1 AND INSTRUCTOR_ID = $2`,
      [courseId, req.user.id]
    );
    const courseTages = await pool.query(
      `SELECT * FROM COURSES_TAGS WHERE COURSE_ID = $1`,
      [courseId]
    );
    console.log("courseTages:", courseTages.rows);
    if (course.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      course: course.rows[0],
      courseTags: courseTages.rows,
    });
  } catch (error) {
    console.error("getDraftedCourseDetail error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateDraftedCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    console.log("body:", req.body);
    if (!title || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updatedCourse = await pool.query(
      `UPDATE COURSES SET TITLE = $1, DESCRIPTION = $2,  PRICE = $3 WHERE ID = $4 AND INSTRUCTOR_ID = $5 RETURNING *`,
      [title, description, price, id, req.user.id]
    );

    if (updatedCourse.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

const getCreatedCourse = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const coursesContent = await CourseContent.find({
      instructorId: instructorId,
    });
    const coursePromises = coursesContent.map(async (content) => {
      return await pool.query(
        `SELECT * FROM COURSES WHERE ID = $1 AND INSTRUCTOR_ID = $2 AND IS_PUBLISHED = $3`,
        [content.courseId, instructorId, false]
      );
    });
    const courses = await Promise.all(coursePromises);
    const mapedCourses = courses
      .map((course) => course.rows[0])
      .filter(Boolean);

    console.log("mapedCourses:", mapedCourses);

    if (mapedCourses.length === 0) {
      return res.status(200).json({
        message: "No courses found",
        courses: mapedCourses,
      });
    }

    return res.status(200).json({
      courses: mapedCourses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

const publishCourse = async (req, res) => {
  try {
    const { courseId, instructorName } = req.body;
    const instructorId = req.user?.id
    console.log("instructorName:", instructorName);
    if (!courseId || !instructorName) {
      return res.status(400).json({
        message: "credential is required",
      });
    }
    const course = await pool.query(
      `UPDATE COURSES SET IS_PUBLISHED = $1 WHERE ID = $2 AND INSTRUCTOR_ID = $3 RETURNING *`,
      [true, courseId, req.user.id]
    );
    console.log("course:", course);
    if (course.rowCount === 0) {
      return res.status(404).json({
        message: "Course not found or already published",
      });
    }

    const courseTitle = course.rows[0]?.title

    // start gmail automation queue work

    const studentsOfInstructor = await pool.query(
      `
        SELECT DISTINCT s.id, s.name, s.email
        FROM students s
        JOIN enrolled_courses ec ON ec.student_id = s.id
        JOIN courses c ON c.id = ec.course_id
        WHERE c.instructor_id = $1
      `, [instructorId]
    )

    if (studentsOfInstructor.rowCount > 0) {
      await notifyQueue.add("sendEmailNotification", {
        students: studentsOfInstructor.rows,
        courseName: courseTitle,
        instructorName:instructorName
      })
    }


    return res.status(200).json({
      message: "Course published successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

const deleteCourse = async (req, res) => {
  const client = await pool.connect();

  try {
    const { courseId } = req.body;

    if (!courseId) {
      client.release();
      return res.status(400).json({ message: "Invalid courseId" });
    }

    await client.query("BEGIN");

    // Check if course exists
    const course = await client.query(
      `SELECT id FROM courses WHERE id = $1`,
      [courseId]
    );

    if (course.rowCount === 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete from COURSES -> CASCADE removes tags, reviews, cart, enrollments, progress
    await client.query(
      `DELETE FROM courses WHERE id = $1`,
      [courseId]
    );

    await client.query("COMMIT");
    client.release();

    return res.status(200).json({
      message: `Course '${courseId.slice(0, 5)}...' deleted successfully`
    });

  } catch (error) {
    await client.query("ROLLBACK");
    client.release();
    console.error("Delete Course Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  registerInstructorDetails,
  createCourse,
  courseTags,
  uploadCourseContent,
  publishedCourse,
  draftedCourse,
  getDraftedCourseDetail,
  updateDraftedCourse,
  getCreatedCourse,
  publishCourse,
  deleteCourse
};
