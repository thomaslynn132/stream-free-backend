const { isValidObjectId } = require("mongoose");

module.exports = function (req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ status: 400, message: "Invalid ID" });
    }
    next();
};