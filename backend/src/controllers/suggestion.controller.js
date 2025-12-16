import { pool } from "../db/sql.db.js";

const suggestPagenatedCourses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM COURSES WHERE IS_PUBLISHED = TRUE`
    );
    const totalCourses = Number(totalResult.rows[0].count);

    if (!totalCourses) {
      return res.status(200).json({
        message: "No courses available",
        courses: [],
      });
    }

    const coursesResult = await pool.query(
      `
      WITH paginated_courses AS (
        SELECT ID
        FROM COURSES
        WHERE IS_PUBLISHED = TRUE
        ORDER BY CREATED_DATE DESC, ID
        LIMIT $1 OFFSET $2
      )
      SELECT
        C.ID AS COURSE_ID,
        C.TITLE,
        C.THUMBNAIL,
        C.DESCRIPTION,
        C.PRICE,
        C.CREATED_DATE,
        C.IS_PUBLISHED,

        I.ID AS INSTRUCTOR_ID,
        I.NAME AS INSTRUCTOR_NAME,
        I.EMAIL AS INSTRUCTOR_EMAIL,
        I.PROFILE_PIC,
        I.ABOUT,
        I.EXPERIENCE,

        R.ID AS REVIEW_ID,
        R.STUDENT_ID,
        R.REVIEW,
        R.POINTS,

        CT.TAGS
      FROM paginated_courses PC
      JOIN COURSES C ON C.ID = PC.ID
      LEFT JOIN INSTRUCTOR I ON I.ID = C.INSTRUCTOR_ID
      LEFT JOIN REVIEWS R ON R.COURSE_ID = C.ID
      LEFT JOIN COURSES_TAGS CT ON CT.COURSE_ID = C.ID
      ORDER BY C.CREATED_DATE DESC, C.ID
      `,
      [limit, offset]
    );

    const courseMap = {};

    for (const row of coursesResult.rows) {
      const courseId = row.course_id;

      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          id: row.course_id,
          title: row.title,
          thumbnail: row.thumbnail,
          description: row.description,
          price: row.price,
          created_date: row.created_date,
          is_published: row.is_published,
          instructor: {
            id: row.instructor_id,
            name: row.instructor_name,
            email: row.instructor_email,
            profile_pic: row.profile_pic,
            about: row.about,
            experience: row.experience,
          },
          reviews: [],
          tags: [],
        };
      }

      /* Reviews */
      if (row.review_id) {
        const exists = courseMap[courseId].reviews.some(
          (r) => r.id === row.review_id
        );
        if (!exists) {
          courseMap[courseId].reviews.push({
            id: row.review_id,
            student_id: row.student_id,
            review: row.review,
            points: row.points,
          });
        }
      }

      if (row.tags) {
        if (!courseMap[courseId].tags.includes(row.tags)) {
          courseMap[courseId].tags.push(row.tags);
        }
      }
    }
    
    return res.status(200).json({
      message: "Courses fetched successfully",
      pagination: {
        totalCourses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        limit,
      },
      courses: Object.values(courseMap),
    });
  } catch (error) {
    console.error("Pagination Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



const getSingleCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params
    if (!courseId) {
      return res.status(400).json({
        "message": "course is required"
      })
    }

    let courseMap = {}

    const course = await pool.query(
      ` SELECT 
        C.ID AS COURSE_ID,
        C.TITLE,
        C.THUMBNAIL,
        C.DESCRIPTION,
        C.PRICE,
        C.CREATED_DATE,
        C.IS_PUBLISHED,

        I.ID AS INSTRUCTOR_ID,
        I.NAME AS INSTRUCTOR_NAME,
        I.EMAIL AS INSTRUCTOR_EMAIL,
        I.PROFILE_PIC,
        I.ABOUT,
        I.EXPERIENCE,

        R.ID AS REVIEW_ID,
        R.STUDENT_ID,
        R.REVIEW,
        R.POINTS,

        CT.ID AS TAGS_ID,
        CT.TAGS

        FROM COURSES C
        LEFT JOIN INSTRUCTOR I ON I.ID = C.INSTRUCTOR_ID
        LEFT JOIN REVIEWS R ON R.COURSE_ID = C.ID
        LEFT JOIN COURSES_TAGS CT ON CT.COURSE_ID = C.ID
        WHERE C.ID = $1
      `,
      [courseId]
    );

    if (course.rows.length == 0) {
      return res.status(200).json({
        message: "course not found"
      })
    }

    course.rows.forEach((row) => {
      const courseId = row.course_id;
      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          id: row.course_id,
          title: row.title,
          thumbnail: row.thumbnail,
          description: row.description,
          price: row.price,
          created_date: row.created_date,
          is_published: row.is_published,
          instructor: {
            id: row.instructor_id,
            name: row.instructor_name,
            email: row.instructor_email,
            profile_pic: row.profile_pic,
            about: row.about,
            experience: row.experience,
          },
          reviews: [],
          tags: [],
        };
      }
      console.log("row.review_id", row.review_id)
      if (row.review_id) {
        const isInclude = courseMap[courseId].reviews.some((review) => review.id === row.review_id)
        console.log("isInclude", isInclude)
        if (!isInclude) {
          courseMap[courseId].reviews.push({
            id: row.review_id,
            student_id: row.student_id,
            review: row.review,
            points: row.points,
          });
        }

      }
      if (row.tags_id) {
        const isInclude = courseMap[courseId].tags?.includes(row.tags)
        if (!isInclude) {
          courseMap[courseId].tags.push(row.tags);
        }
      }
    });

    return res.status(200).json({
      message: "course fetched",
      course: courseMap[courseId]
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}

export { suggestPagenatedCourses, getSingleCourseDetail };
