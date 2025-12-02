import { pool } from "../db/sql.db.js";

const suggestPagenatedCourses = async (req, res) => {
  try {
    //with pagenation
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let courseMap = {};
    console.log("page", req.query.page);

    const allCourses = await pool.query(
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
        WHERE C.IS_PUBLISHED = TRUE
        ORDER BY C.CREATED_DATE
        LIMIT $1 OFFSET $2
      `,
      [limit, skip]
    );

    console.log("allCourses.rows;", allCourses.rows);

    allCourses.rows.forEach((row) => {
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

    let formatedCourse = Object.values(courseMap);
    console.log("formatedCourse:", formatedCourse)
    if (!formatedCourse.length)
      return res.status(200).json({ message: "no ccoursses available" });
    return res.status(200).json({
      message: "courses fetched",
      courses: formatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
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
