import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendEmailToStudent = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"LMS Notifications" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log("Email sent to:", to);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
}

export default sendEmailToStudent;