import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseContentSchema = new Schema({
  courseId: { type: String, required: true },
  instructorId: { type: String, required: true },
  isReadyToPublish: { type: Boolean, default: false },
  content: [
    {
      title: { type: String },
      videoUrl: [
        {
          url: { type: String },
          resolution: {
            type: String,
            enum: ["360p", "480p", "720p", "1080p", "auto"],
            default: "auto",
          },
        },
      ],
      status: { type: String, enum: ["success", "fail", "processing"] },
      createdOn: { type: Date, default: Date.now },
    },
  ],
});

const studentQueryAndAnswerToChatBot = new Schema({
  studentId: { type: String, required: true },
  queries: [
    {
      questions: { type: String, required: true },
      botResponse: { type: String, reqired: true },
    },
  ],
});

const coursesSuggestion = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  coursesSuggestion: {
    type: [
      {
        courseId: { type: String, required: true },
        name: { type: String, required: true },
        thumbnail: { type: String, required: true },
      },
    ],
    default: [], // Ensures array is always stored
  },
});

const blacklistTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const liveStreamNotificationSchema = new Schema({
  instructorId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200 // document expires after 7200 seconds = 2 hours
  }

})
const passwordResetSesion = new Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
  }

})

const CourseContent = mongoose.model("CourseContent", courseContentSchema);
const BlackListtoken = mongoose.model("BlackListToken", blacklistTokenSchema);
const StudentQueryToBot = mongoose.model(
  "studentQueryToBot",
  studentQueryAndAnswerToChatBot
);
const Suggestions = mongoose.model("coursesSuggestion", coursesSuggestion);
const liveStreamNotification = mongoose.model("liveStreamNotify", liveStreamNotificationSchema)
const passwordReset = mongoose.model("passwordreset", passwordResetSesion)

export { CourseContent, BlackListtoken, StudentQueryToBot, Suggestions, liveStreamNotification, passwordReset };
