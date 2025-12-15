import dotenv from "dotenv";
dotenv.config({
    path: new URL("../../.env", import.meta.url)
});
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

const emailAPI = new TransactionalEmailsApi();

emailAPI.authentications.apiKey.apiKey = process.env.BREVO_EMAIL_API_KEY;

export const sendEmailToStudent = async ({
    toEmail,
    courseName,
    instructorName,
}) => {
    try {
        const message = new SendSmtpEmail();

        message.subject = `New Course Published: ${courseName}`;
        message.htmlContent = `
      <h3>Hello Student 👋</h3>
      <p>
        A new course <b>${courseName}</b> by
        <b>${instructorName}</b> is now live.
      </p>
      <p>🚀 Happy Learning!</p>
    `;

        message.sender = {
            name: "LMS Notifications",
            email: "donisahu225@gmail.com", // no domain required
        };

        message.to = [
            {
                email: toEmail
            },
        ];

        const response = await emailAPI.sendTransacEmail(message);
        console.log("📧 Email sent:", response.body?.messageId);
    } catch (err) {
        console.log(err)
        console.error(
            "Brevo email failed:",
            err.body || err.message || err
        );
    }
};

export default sendEmailToStudent;