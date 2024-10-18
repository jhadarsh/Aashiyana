const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
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
  contact_number: Number,
  ///
  amenities:[ {
    type: [String], // Array of strings for amenities (e.g., Wi-Fi, laundry, meals)
    default: [],
  },],
  type: {
    type: String,
    enum: ["single", "shared", "PG"], // Define types of accommodations
    required: true,
  },
  availability: {
    type: Boolean,
    default: true, // Indicates if the listing is currently available
  },
  totalRooms: {
    type: Number,
    // required: true,
    min: 1, // At least one room should be there
  },
  occupiedRooms: {
    type: Number,
    // required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return v <= this.totalRooms; // Ensure occupiedRooms is not more than totalRooms
      },
      message: (props) =>
        `Occupied rooms (${props.value}) cannot exceed total rooms (${props.instance.totalRooms}).`,
    },
  },

  //
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
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
