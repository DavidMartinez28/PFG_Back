const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    tipo: { type: String, required: true },
  },
  {
   collection: 'usuarios'
  }
);

//userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
const User = mongoose.model("User", userSchema);
module.exports = User;
