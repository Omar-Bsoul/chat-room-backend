const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      socket: String,
      name: String
    },
    text: String
  },
  { timestamps: true }
);

mongoose.model('messages', MessageSchema);
