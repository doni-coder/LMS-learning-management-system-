import generateUuid from "../utils/generateUuid.utils.js";
import { pool } from "../db/sql.db.js";
import Stripe from "stripe";
import { CourseContent } from "../models/course.models.js";

const stripe = new Stripe(process.env.STRIPE_KEY);
const endPointSecret = process.env.STRIPE_LOCAL_WEBHOOK;

const coursePayment = async (req, res) => {
  try {
    const { courseItems } = req.body;
    const studentId = req.user.id; // Destructure directly
    console.log("courseItems:", courseItems)
    const courseItemsInJson = JSON.parse(courseItems);
    const courseIds = courseItemsInJson.map((items) => items.id);
    const courseImages = courseItemsInJson.map((item) => item.thumbnail);

    const lineItems = courseItemsInJson.map((items) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: items.title,
          images: [items.thumbnail],
        },
        unit_amount: items.price * 100,
      },
      quantity: 1,
    }));

    console.log("lineitems", lineItems)

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "https://lms-learning-management-system-blond.vercel.app/payment-success",
      cancel_url: "https://lms-learning-management-system-blond.vercel.app/payment-cancel",
      metadata: {
        studentId,
        courseIds: JSON.stringify(courseIds),
        images: JSON.stringify(courseImages)
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const conformPaymentAndEnrollCourse = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log("\n======= NEW WEBHOOK EVENT =======");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
    console.log("➡️ Event type received:", event.type);
  } catch (err) {
    console.error("❌ Webhook Signature Error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ Processing checkout.session.completed");

    const session = event.data.object;
    const studentId = session.metadata.studentId;
    const courseIds = JSON.parse(session.metadata.courseIds);

    console.log(`👤 Student ID: ${studentId}`);
    console.log(`📚 Course IDs: ${courseIds}`);

    try {
      for (const courseId of courseIds) {
        const enrolledId = generateUuid();
        const progressId = generateUuid();

        console.log(`📝 Inserting into ENROLLED_COURSES - ID: ${enrolledId}, Course ID: ${courseId}`);
        await pool.query(
          "INSERT INTO ENROLLED_COURSES (id, student_id, course_id) VALUES ($1, $2, $3)",
          [enrolledId, studentId, courseId]
        );

        console.log(`📝 Inserting into COURSES_PROGRESS - ID: ${progressId}, Enrolled Course ID: ${enrolledId}`);
        await pool.query(
          "INSERT INTO COURSES_PROGRESS (id, student_id, enrolled_course) VALUES ($1, $2, $3)",
          [progressId, studentId, enrolledId]
        );
      }

      await client.query(
        "DELETE FROM STUDENT_CART WHERE student_id = $1",
        [studentId]
      );

      console.log("🎉 All Courses Enrolled and Progress Initialized Successfully for Student:", studentId);
    } catch (dbError) {
      console.error("❌ Database Error:", dbError);
      return res.status(500).send("Database error occurred.");
    }
  } else {
    console.log(`⚠️ Ignoring event type: ${event.type}`);
  }

  console.log("======= END OF EVENT =======\n");
  res.status(200).send("Event received");
};

const checkOutProductDetail = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return res.status(400).json({
        message: "session id not exist"
      })
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });
    const courseImages = session.metadata.images;
    console.log(courseImages);
    console.log("lineItems:", lineItems)
    res.status(200).json({
      session,
      lineItems: {
        ...lineItems,
        images: courseImages
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

const getEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user?.id

    const enrolledCourse = await pool.query(
      `SELECT 
       COURSES.ID, 
       COURSES.TITLE, 
       COURSES.THUMBNAIL,
       CP.PERCENTAGE_COMPLETED,
       CP.COMPLETED_MODULES,
       ER.ID AS ENROLLED_ID
       FROM 
       ENROLLED_COURSES AS ER
       INNER JOIN 
       COURSES ON ER.COURSE_ID = COURSES.ID
       INNER JOIN 
       COURSES_PROGRESS AS CP ON ER.ID = CP.ENROLLED_COURSE
       WHERE 
       ER.STUDENT_ID = $1;`,
      [userId]
    );
    console.log("enrolled:", enrolledCourse.rows);

    if (enrolledCourse.rows.length == 0) {
      return res.status(200).json({
        courses: []
      })
    }
    return res.status(200).json({
      courses: enrolledCourse.rows
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}

const getCourseContent = async (req, res) => {
  try {
    const courseId = req.params?.courseId;
    const courseContent = await CourseContent.find({ courseId });
    if (!courseContent) {
      return res.status(200).json({
        message: "content not found",
        courseContent: []
      })
    }
    return res.status(200).json({
      courseContent: courseContent[0].content
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}

const updateCourseCompletionStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId, totalModule, moduleNo } = req.body
    console.log(courseId, totalModule, moduleNo)
    if (!courseId || !String(totalModule) || !String(moduleNo)) {
      return res.status(400).json({
        message: "all fields are required"
      })
    }

    const isModuleAlreadyCompleted = await pool.query(`
      SELECT COMPLETED_MODULES FROM COURSES_PROGRESS WHERE ENROLLED_COURSE = $1 AND STUDENT_ID = $2
    `, [courseId, userId]);

    console.log(isModuleAlreadyCompleted.rows[0]);

    const completedModules = isModuleAlreadyCompleted.rows[0].completed_modules || [];
    const isIncludes = completedModules.includes(moduleNo);


    if (!isIncludes) {

      const completedModuleLength = isModuleAlreadyCompleted.rows[0]?.completed_modules?.length || 0
      const totalCompletedPercentage = ((completedModuleLength + 1) / totalModule) * 100
      console.log("totalCompletedPercentage", totalCompletedPercentage)

      const moduleCompletionResult = await pool.query(`
      UPDATE COURSES_PROGRESS 
      SET COMPLETED_MODULES = array_append(COMPLETED_MODULES, $1),
      PERCENTAGE_COMPLETED = $2 
      WHERE ENROLLED_COURSE = $3 AND STUDENT_ID = $4
      RETURNING *
    `, [moduleNo, totalCompletedPercentage, courseId, userId]);

      return res.status(200).json({
        courseCompletionStatus: moduleCompletionResult.rows[0]
      })

    }

    return res.status(400).json({
      message: "already completed"
    })


  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export { coursePayment, getCourseContent, conformPaymentAndEnrollCourse, checkOutProductDetail, getEnrolledCourse, updateCourseCompletionStatus };