import generateUuid from "../utils/generateUuid.utils.js";
import { pool } from "../db/sql.db.js";

const registerStudentDetails = async (req, res) => {
  try {
    const { phoneNo, country, state, city, pinCode } = req.body;
    const userId = req.user.id;

    const addressResult = await pool.query(
      `INSERT INTO ADDRESSES(ID,COUNTRY,STATE,CITY,PIN_CODE) VALUES($1,$2,$3,$4,$5) RETURNING *;`,
      [generateUuid(), country, state, city, pinCode]
    );
    const updateStudent = await pool.query(
      `UPDATE STUDENTS SET PHONE_NO = $1, ADDRESS = $2 WHERE ID = $3 RETURNING *;`,
      [phoneNo, addressResult.rows[0].id, userId]
    );

    return res.status(200).json({
      message: "profile updated successfuly",
      user: updateStudent.rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "add to cart failed" });
    }

    const isItemExist = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM STUDENT_CART 
        WHERE STUDENT_ID = $1 AND COURSE_ID = $2
      )`,
      [studentId, courseId]
    );

    if (isItemExist.rows[0].exists) {
      return res.status(400).json({
        message: "Item already in cart",
      });
    }

    const id = generateUuid();
    await pool.query(
      `INSERT INTO STUDENT_CART(ID, STUDENT_ID, COURSE_ID) 
       VALUES($1, $2, $3)`,
      [id, studentId, courseId]
    );

    return res.status(200).json({
      message: "1 item added to cart",
    });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({ message: "internal error" });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        message: "add to cart failed",
      });
    }

    await pool.query(
      `DELETE FROM STUDENT_CART WHERE STUDENT_ID = $1 AND COURSE_ID = $2 RETURNING *`,
      [String(studentId), String(courseId)]
    );

    return res.status(200).json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getStudentEnrolledCourse = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "not valid student id",
      });
    }

    const enrolledCourses = await pool.query(
      `SELECT COURSES.*
       FROM COURSES
       LEFT JOIN ENROLLED_COURSES
       ON COURSES.ID = ENROLLED_COURSES.COURSE_ID
       AND ENROLLED_COURSES.STUDENT_ID = $1
      `,
      [studentId]
    );

    if (!enrolledCourses.rows.length) {
      return res.status(400).json({
        message: "No courses enrolled",
      });
    }

    return res.status(200).json({
      message: "course fetched",
      courses: enrolledCourses.rows,
    });
  } catch (error) {
    return res.status(400).json({
      message: "No courses enrolled",
    });
  }
};

const getAddToCartItems = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("STUDENT ID:", studentId)
    if (!studentId) {
      return res.status(400).json({
        message: "invalid studentId",
      });
    }

    const cartItems = await pool.query(
      `SELECT c.* 
      FROM STUDENT_CART sc
      JOIN COURSES c ON sc.COURSE_ID = c.ID
      WHERE sc.STUDENT_ID = $1`,
      [studentId]
    );

    console.log("CARTITEMS:", cartItems.rows)

    if (cartItems.rows.length == 0) {
      return res.status(200).json({
        cart: [],
      });
    }

    return res.status(200).json({
      message: "cart item fetcched",
      cart: cartItems.rows,
    });
  } catch (error) {
    return res.status(200).json({
      cart: [],
    });
  }
};

const giveReviews = async (req, res) => {
  try {
    const { review, points, courseId } = req.body;
    const studentId = req.user?.id;

    const isAlreadyReviewed = await pool.query(`
      SELECT EXISTS (SELECT 1 FROM REVIEWS WHERE STUDENT_ID = $1 AND COURSE_ID = $2)
    `, [studentId, courseId]);

    if (isAlreadyReviewed.rows[0].exists) {
      return res.status(200).json({
        message: "you already reviewed!"
      })
    }


    if (!points || !studentId || !courseId) {
      return res.status(400).json({ message: "all parameter required" });
    }

    await pool.query(
      `INSERT INTO REVIEWS(id,student_id,course_id,review,points) VALUES($1,$2,$3,$4,$5)`,
      [generateUuid(), studentId, courseId, review || "", Number(points)]
    );

    return res.status(200).json({
      message: "review submited"
    })

  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
      error: error.message
    });
  }
};

export {
  registerStudentDetails,
  addToCart,
  removeFromCart,
  getStudentEnrolledCourse,
  getAddToCartItems,
  giveReviews,
};
