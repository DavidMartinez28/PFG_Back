const express = require('express');

require('../utils/db');

const PORT = 3000;
const server = express();

const Paciente = require('../models/Pacientes');

const router = express.Router();

router.get('/pacientes', async (req, res) => {
	try {
		const pacientes = await Paciente.find();
		return res.status(200).json(pacientes)
	} catch (err) {
		return res.status(500).json(err);
	}
});

server.use('/', router);

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});