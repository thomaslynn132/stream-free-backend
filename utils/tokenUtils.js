const jwt = require('jsonwebtoken');

const generateToken = (data, secret, expiresIn) => {
    return jwt.sign(data, secret, { expiresIn });
};

const generateAccessToken = (tokenData) => {
    return generateToken(tokenData, process.env.JWT_SECRET, '1d');
};

const generateRefreshToken = (tokenData) => {
    return generateToken(tokenData, process.env.REFRESH_TOKEN_SECRET, '30d');
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};