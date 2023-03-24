const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const psicologoSchema = new Schema(
  {
    fecha_nacimiento: {type: Date,required: true },
    name: { type: String, required: true },//La propiedad required hace que el campo sea obligatorio
    correo: {type: String,required: true},
    descripcion: {type: String,required: true},
    telefono: {type: Number,required: true},
    sexo: {type: String,required: true},
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const Psicologos = mongoose.model('Psicologos', psicologoSchema);
module.exports = Psicologos;

