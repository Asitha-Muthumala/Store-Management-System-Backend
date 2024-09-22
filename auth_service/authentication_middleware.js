const JWT = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(400).json({
            status: false,
            message: "Access Denied, no token provided"
        });
    }

    const tokenParts = authHeader.split(' ');
    
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(400).json({
            status: false,
            message: "Invalid token format"
        });
    }

    const token = tokenParts[1];

    try {
        const verified = JWT.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Invalid token"
        });
    }
};
