const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  college: String,
  contact_number:Number,
  menu:[
    {
        type : String,
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId, // ya phir mongoose.Schema.Types.ObjectId kar sakte hai
      ref: "Review",
    }, 
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Mess = mongoose.model("Mess", messSchema);
module.exports = Mess;