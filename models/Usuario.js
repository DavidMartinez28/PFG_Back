const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum:['Psicologo', 'Paciente'], required: true },
  },
  {
   collection: 'usuarios'
  }
);

//userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
const User = mongoose.model("Usuarios", userSchema);
module.exports = User;
