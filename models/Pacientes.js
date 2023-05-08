const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const pacientesSchema = new Schema(
  {
    fecha_nacimiento: {type: Date,required: true },
    name: { type: String, required: true },//La propiedad required hace que el campo sea obligatorio
    email:{ type: String, required: true, ref:'Usuarios'},
    descripcion: {type: String},
    telefono: {type: Number,required: true},
    sexo: {type: String,required: true},
    foto: {type: String,required: true}
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const Pacientes = mongoose.model('Pacientes', pacientesSchema);
module.exports = Pacientes;

