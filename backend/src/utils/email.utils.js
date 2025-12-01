import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, message) => {
    try {
        const info = await transporter.sendMail({
            from: `'"My courses" <${process.env.EMAIL_USER}>'`,
            to: to,
            subject: "My courses password reset",
            text: "My courses",
            html: `<p>Password reset otp - <b>${message}</b></p>`
        })
    } catch (error) {
        console.log("error from sendEmail:", error.message)
    }
}

export { sendEmail }