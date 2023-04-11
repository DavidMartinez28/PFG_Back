const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const filesSchema = new Schema(
  {
    id_psicologo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Psicologo'
    },
    id_paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes'   
    },

    urlFile: {type: String},
    nameFile: {type: String},
    estado: {type: String},
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const File = mongoose.model('File', filesSchema);
module.exports = File;
