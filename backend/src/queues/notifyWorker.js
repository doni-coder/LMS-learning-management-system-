import { Worker } from "bullmq";
import { redis } from "../utils/redisClient.utils.js";
import sendEmailToStudent from "../services/emailService.service.js";

export const notifyWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("Worker received job:", job.id);

        const { students, courseName, instructorName } = job.data;
        console.log("emailStudents:", students)
        console.log("jobs:", job.data)
        for (const s of students) {
            await sendEmailToStudent(
                s.email,
                `New Course: ${courseName}`,
                `Hi ${s.name}, a new course by ${instructorName} is now live!`
            );
        }
    },
    { connection: redis }
);
