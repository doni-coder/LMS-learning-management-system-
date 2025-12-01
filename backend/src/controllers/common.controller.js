import { pool } from "../db/sql.db.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import generateUuid from "../utils/generateUuid.utils.js";
import { passwordReset as passwordResetModel } from "../models/course.models.js";
import { generateOtp } from "../utils/otp.utils.js";
import { sendEmail } from "../utils/email.utils.js";

export const registerUser = async (req, res) => {
  try {
    const { userRole, name, email, password } = req.body;
    const profilePic = req.files?.["profilePic"]?.[0].path;

    console.log("profile:", req.files?.["profilePic"]?.[0]);
    console.log(profilePic, userRole, name, email, password);

    if (!profilePic || !userRole || !name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (userRole === "instructor") {
      const isInstructorExist = await pool.query(
        `SELECT EXISTS (SELECT 1 FROM INSTRUCTOR WHERE EMAIL = $1);`,
        [email]
      );
      if (isInstructorExist.rows[0].exists) {
        return res.status(400).json({
          message: "Instructor already exists!",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const { autoCropUrl } = await uploadToCloudinary(profilePic);
      if (!autoCropUrl) {
        return res.status(500).json({
          message: "Internal error",
        });
      }
      const registeredInstructor = await pool.query(
        `INSERT INTO INSTRUCTOR (ID,NAME,EMAIL,PROFILE_PIC,PASSWORD) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
        [generateUuid(), name, email, autoCropUrl, hashedPassword]
      );
      if (registeredInstructor.rows.length === 0) {
        return res.status(500).json({
          message: "server error",
        });
      }

      return res.status(200).json({
        message: "Instructor registered successfully!",
        user: registeredInstructor.rows[0],
      });
    }

    if (userRole === "student") {
      const isStudentExist = await pool.query(
        `SELECT EXISTS (SELECT 1 FROM STUDENTS WHERE EMAIL = $1);`,
        [email]
      );
      if (isStudentExist.rows[0].exists) {
        return res.status(400).json({
          message: "Student already exists!",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const { autoCropUrl } = await uploadToCloudinary(profilePic);
      if (!autoCropUrl) {
        return res.status(500).json({
          message: "Internal error",
        });
      }
      const registeredStudent = await pool.query(
        `INSERT INTO STUDENTS (ID,NAME,EMAIL,PROFILE_PIC,PASSWORD) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
        [generateUuid(), name, email, autoCropUrl, hashedPassword]
      );

      if (registeredStudent.rows.length === 0) {
        return res.status(500).json({
          message: "server error",
        });
      }

      return res.status(200).json({
        message: "Student registered successfully!",
        user: registeredStudent.rows[0],
      });
    }
  } catch (error) {
    console.log("error:", error.message)
    console.log("error:", error)
    return res.status(400).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const saveUserToCorrectTable = async (req, res) => {
  try {
    const { id, name, profilePic, email, authid, userRole } = req.body;

    if (!userRole || !["student", "instructor"].includes(userRole)) {
      return res.status(400).send("Invalid role selected.");
    }

    let insertQuery;
    if (userRole === "student") {
      insertQuery = `INSERT INTO students (id, name, email, profile_pic, auth_id)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING *;`;
    } else {
      insertQuery = `INSERT INTO instructor (id, name, email, profile_pic, auth_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    }

    const result = await pool.query(insertQuery, [
      id,
      name,
      email,
      profilePic,
      authid,
    ]);

    const user = result.rows[0];

    const userWithRole = { ...user, userRole: userRole };

    console.log("userWithRole:", userWithRole);

    req.login(userWithRole, (err) => {
      if (err) {
        console.log(`Error logging in after registration: ${err}`);
        return res.status(500).send("Error logging in after registration.");
      }
      return res.status(200).json(userWithRole);
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const sendTempUser = async (req, res, next) => {
  if (req.session.tempUser) {
    res.json({ user: req.session.tempUser });
  } else {
    res.status(404).json({ message: "No temp user" });
  }
};

export const passwordResetOtp = async (req, res, next) => {
  try {
    const { email, userRole } = req.body
    console.log(email, userRole)
    if (!email || !userRole) {
      return res.status(400).json({
        message: "email required"
      })
    }
    const tableName = userRole == "student" ? "students" : "instructor"
    const isEmailExist = await pool.query(`SELECT EXISTS (SELECT 1 FROM ${tableName} WHERE EMAIL = $1)`, [email])

    if (!isEmailExist.rows[0].exists) {
      return res.status(400).json({
        message: "email not exist"
      })
    }
    const isOtpAlreadySent = await passwordResetModel.findOne({ email })
    if (isOtpAlreadySent) {
      return res.status(200).json({
        message: "otp already sent"
      })
    }

    const otp = generateOtp()
    await passwordResetModel.create({ email: email, otp: otp })
    await sendEmail(email, `your otp is ${otp}`)
    res.status(200).json({
      message: "OTP sent successfully",
      email: email,
      userRole: userRole
    });


    // res.redirect(`http://localhost:5173/enter-otp/?email=${encodeURIComponent(email)}&userRole=${encodeURIComponent(userRole)}`)

  } catch (error) {
    console.log("error from passwordResetOtp: ", error.message)
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export const validateOtp = async (req, res, next) => {
  try {
    const { email, otp, userRole } = req.body
    if (!email || !otp) {
      return res.status(400).json({
        message: "missing parameter"
      })
    }
    console.log(email, otp, userRole)
    const isValid = await passwordResetModel.find({ email, otp })
    if (!isValid) {
      return res.status(400).json({ message: "otp not matched!" })
    }

    return res.status(200).json({
      message: "OTP verified",
      email: email,
      otp,
      userRole: userRole
    });


  } catch (error) {
    console.log("error from password reset :", error.message)
    return res.status(501).json({
      message: "unable to reset password"
    })
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    let { otp, email, newpassword, userRole } = req.body
    if (!email || !newpassword || !userRole) {
      return res.status(400).json({
        message: "invalid credintials"
      })
    }
    console.log("newpassword:", newpassword)
    userRole = userRole == "student" ? "students" : "instructor"
    const isValid = await passwordResetModel.find({ email, otp })
    if (!isValid) {
      return res.status(400).json({ message: "session expired" })
    }
    const hasedPassword = await bcrypt.hash(newpassword, 10)
    await pool.query(`UPDATE ${userRole} SET PASSWORD = $1 WHERE EMAIL = $2`, [hasedPassword, email])

    res.status(200).json({
      message: "password updated!"
    })


  } catch (error) {
    console.log("error from password reset :", error.message)
    return res.status(501).json({
      message: "unable to reset password"
    })
  }
}