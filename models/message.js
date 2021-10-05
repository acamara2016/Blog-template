const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({

  messageContent:{
    type: String,
    required: true
  },
  from:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('messages', messageSchema);