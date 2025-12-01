export const generateOtp = () => {
    const otp = Math.round(1000 + Math.random() * 9000)
    return otp
}