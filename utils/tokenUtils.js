import sign from "jsonwebtoken";

const generateToken = (data, secret, expiresIn) => {
  return sign(data, secret, { expiresIn });
};

export const generateAccessToken = (tokenData) => {
  return generateToken(tokenData, process.env.JWT_SECRET, "1d");
};

export const generateRefreshToken = (tokenData) => {
  return generateToken(tokenData, process.env.REFRESH_TOKEN_SECRET, "30d");
};
