import jwt from "jsonwebtoken";

const generateJwtToken = (uniqueId,email,authId) => {
  if (authId) {
    return jwt.sign({ id: uniqueId, email: email,authId:authId }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });
  }
  return jwt.sign({ id: uniqueId, email: email }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

export default generateJwtToken;
