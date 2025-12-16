import LocalStrategy from "passport-local";
import passport from "passport";
import { pool } from "../db/sql.db.js";
import bcrypt from "bcrypt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import generateUuid from "../utils/generateUuid.utils.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const usePassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const userRole = req.body?.userRole.trim().toLowerCase();
          if (!userRole || !["student", "instructor"].includes(userRole)) {
            return done(null, false, { message: "Invalid user role." });
          }
          if (userRole == "student") {
            const result = await pool.query(
              `SELECT * FROM STUDENTS WHERE EMAIL = $1;`,
              [email]
            );

            if (result.rows.length === 0) {
              return done(null, false, { message: "Incorrect email." });
            }

            const user = result.rows[0];

            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password
            );
            if (!isPasswordCorrect) {
              return done(null, false, { message: "Incorrect password." });
            }
            user.role = userRole;

            return done(null, user);
          }
          if (userRole == "instructor") {
            const result = await pool.query(
              `SELECT * FROM INSTRUCTOR WHERE EMAIL = $1;`,
              [email]
            );

            if (result.rows.length === 0) {
              return done(null, false, { message: "Incorrect email." });
            }

            const user = result.rows[0];

            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password
            );
            if (!isPasswordCorrect) {
              return done(null, false, { message: "Incorrect password." });
            }

            user.userRole = userRole;

            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

const usePassportGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Google Profile:", profile);
        try {
          let result = await pool.query(
            `SELECT * FROM students WHERE AUTH_ID = $1;`,
            [profile.id]
          );

          if (result.rows.length > 0) {
            console.log(true);
            console.log("User found in students table:", result.rows[0]);
            return done(null, result.rows[0]); // User exists
          }
          result = await pool.query(
            `SELECT * FROM instructor WHERE AUTH_ID = $1;`,
            [profile.id]
          );
          if (result.rows.length > 0) {
            return done(null, result.rows[0]);
          }

          const tempUser = {
            id: generateUuid(),
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
            authid: profile.id,
            role: null,
          };
          return done(null, tempUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  const role = user.user_role || user.role || null;
  console.log("Serializing user:", { id: user.id, userRole: role });
  done(null, { id: user.id, userRole: role });
});


passport.deserializeUser(async (obj, done) => {
  try {
    const tableName = obj.userRole === "student" ? "STUDENTS" : "INSTRUCTOR";
    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE ID = $1;`,
      [obj.id]
    );
    if (result.rows.length === 0) {
      return done(null, false);
    }
    const plainUser = result.rows[0];
    const user = {
      id: plainUser.id,
      name: plainUser.name,
      email: plainUser.email,
      phoneNo: plainUser.phone_no,
      profile_pic: plainUser.profile_pic,
      user_role: plainUser.user_role,
      about: plainUser.about,
      experience: plainUser.experience,
    };

    console.log("user found: ", user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { usePassportLocal, usePassportGoogle };
