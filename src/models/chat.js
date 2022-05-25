const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;