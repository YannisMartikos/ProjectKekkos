const mongoose = require("mongoose");
//Properties of the object user
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } //speciall MongoDB function for createdAt
);

module.exports = mongoose.model("User", UserSchema);  //So that we can use this model inside our router