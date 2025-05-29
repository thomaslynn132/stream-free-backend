const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Like', likeSchema);