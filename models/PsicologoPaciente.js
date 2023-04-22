const mongoose = require('mongoose');

const PsicologoPacienteSchema = new mongoose.Schema({
  id_psicologo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Psicologos'
  },
  id_paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pacientes'
   
  }
});

const PsicologoPaciente = mongoose.model('psicologoPaciente', PsicologoPacienteSchema);
module.exports = PsicologoPaciente;
