const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomId: String, // Room identifier (if you want private chats per room)
    sender: String, // User or host ID
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
