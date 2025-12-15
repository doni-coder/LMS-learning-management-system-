import express from "express";
import cors from "cors";
import {
  usePassportLocal,
  usePassportGoogle,
} from "./middlewares/passport.middleware.js";
import session from "express-session";
import passport from "passport";
import { router as studentRoute } from "./routes/student.routes.js";
import { router as instructorRoute } from "./routes/instructor.routes.js";
import { router as authRoute } from "./routes/auth.routes.js";
import { router as commonRoute } from "./routes/common.routes.js";
import { router as suggestRoute } from "./routes/suggestion.routes.js";
import { router as courseRoute } from "./routes/course.routes.js"
import { router as liveStreamRoute } from "./routes/liveStream.routes.js"
import { Server } from "socket.io";
import { registerUser } from "./controllers/common.controller.js";
import { createServer } from "http";
import upload from "./middlewares/multer.middelware.js";
import { isLoggedIn } from "./middlewares/auth.middleware.js";
import { conformPaymentAndEnrollCourse } from "./controllers/course.controller.js";
import { liveStreamNotification } from "./models/course.models.js";
import { pool } from "./db/sql.db.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://lms-learning-management-system-blond.vercel.app",
    ],
    credentials: true
  },
});


const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});


usePassportLocal();
usePassportGoogle();
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-learning-management-system-blond.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.post("/webhook", express.raw({ type: "application/json" }), conformPaymentAndEnrollCourse);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.static("./public"));
app.use("/api/student", studentRoute);
app.use("/api/instructor", instructorRoute);
app.use("/auth", authRoute);
app.use("/suggest", suggestRoute);
app.use("/api/common", commonRoute);
app.use("/api/course", courseRoute);
app.use("/api/live-stream", liveStreamRoute)

//------------ testing ----------------
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/webhook", conformPaymentAndEnrollCourse)

//web socket --------
io.use((socket, next) => {
  sessionConfig(socket.request, {}, next);
});

const broadcaster = new Map()

io.on("connection", (socket) => {

  socket.on("create:room", async (data) => {
    const roomToken = await liveStreamNotification.create({
      instructorId: data.instructorId,
      courseId: data.courseId,
      key: data.key,
      room: data.room
    })
    if (roomToken) {
      socket.join(roomToken.courseId)
      broadcaster.set(roomToken.courseId, socket.id)
      io.to(socket.id).emit("room:created", {})
    }
  })

  socket.on("offer", ({ id, offer }) => {
    io.to(id).emit("offer", { id: socket.id, offer })
  })

  socket.on("answer", ({ courseId, ans }) => {
    const instructorId = broadcaster.get(courseId)
    if (instructorId) {
      io.to(instructorId).emit("answer", { id: socket.id, answer: ans })
    }
  })

  socket.on("join:stream", (data) => {
    const broadCasterId = broadcaster.get(data.courseId)
    if (broadCasterId) {
      socket.join(data.courseId)
      io.to(broadCasterId).emit("student:joined", { joinedStudent: socket.id })
      io.to(socket.id).emit("joined", {})
    }
  })

  socket.on("instructor:end-stream", ({ courseId }) => {

    io.to(courseId).emit("stream-ended", {
      message: "Class ended by Instructor"
    });

    broadcaster.delete(courseId); // Remove broadcaster reference
  });



  socket.on("ice-candidate", ({ targetId, candidate }) => {
    io.to(targetId).emit("ice-candidate", {
      candidate,
      fromId: socket.id,
    });
  });

  socket.on("joinChatRoom", (data) => {
    socket.join(data.courseId)
  })

  socket.on("sendChat", (data) => {
    socket.to(data.courseId).emit("receiveMessage", { message: data.message, from: data.from })
  })



  socket.on("disconnect", () => {
    broadcaster.forEach((broadcasterId, courseId) => {
      if (broadcasterId === socket.id) {
        broadcaster.delete(courseId);
        io.to(courseId).emit("disconnectPeer", socket.id);
      }
    });
  });

})

export { server, io };