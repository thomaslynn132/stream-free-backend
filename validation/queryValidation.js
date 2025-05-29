const { isValidObjectId } = require("mongoose");

exports.queryValidation = (id, res, text) => {
    if (!isValidObjectId(id)) return res.status(400).json({ message: text });
}