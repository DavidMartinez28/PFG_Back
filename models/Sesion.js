const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const sesionSchema = new Schema(
  {
    id_psicologo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Psicologo'
    },
    id_paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes'   
    },
    fecha: {type: Date,required: true },
    estado: { type: String, required: true },//La propiedad required hace que el campo sea obligatorio
    nombrePaciente: { type: String, required: true },
    nombrePsicologo: { type: String, required: true },
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const Sesiones = mongoose.model('Sesiones', sesionSchema);
module.exports = Sesiones;