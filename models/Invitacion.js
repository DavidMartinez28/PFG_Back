const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const invitacionSchema = new Schema(
  {
    id_psicologo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Psicologo'
    },
    id_paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes'   
    },
    estado: {type: String},
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const Invitacion = mongoose.model('Invitacion', invitacionSchema);
module.exports = Invitacion;