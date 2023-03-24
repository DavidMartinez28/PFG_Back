const mongoose = require('mongoose');

// Imporatmos el modelo Pet en este nuevo archivo.
const Pacientes = require('../models/Pacientes');

const pacientes = [
  {
    fecha_nacimiento: new Date ('2002-04-23'),
    name: 'Pedro Jimenez',
    correo: 'pedroji@gmail.com',
    descripcion: 'Estudiante de universidad',
    telefono: 654323751,
    sexo: 'Masculino',
  },
  {
    fecha_nacimiento: new Date ('1998-07-03'),
    name: 'Juan Perez',
    correo: 'juan@gmail.com',
    descripcion: 'Trabajador en una empresa de ingeniería informática',
    telefono: 689021476,
    sexo: 'Masculino',
  },
  {
    fecha_nacimiento: new Date ('1990-11-11'),
    name: 'Paula Martin',
    correo: 'paula@gmail.com',
    descripcion: 'Profesora de educación infantil',
    telefono: 677786932,
    sexo: 'Femenino',
  },
];

const pacientesDocuments = pacientes.map(pacientes => new Pacientes(pacientes));

mongoose
  .connect('mongodb+srv://davidmg2841:Escalada28@cluster0.swgeflz.mongodb.net/PFG?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
		// Utilizando Character.find() obtendremos un array con todos los personajes de la db
    const allpacientes = await Pacientes.find();
		
		// Si existen personajes previamente, dropearemos la colección
    if (allpacientes.length) {
      await Pacientes.collection.drop(); //La función drop borra la colección
    }
  })
  .catch((err) => console.log(`Error deleting data: ${err}`))
  .then(async () => {
		// Una vez vaciada la db de los personajes, usaremos el array characterDocuments
		// para llenar nuestra base de datos con todas los personajes.
		await Pacientes.insertMany(pacientesDocuments);
	})
  .catch((err) => console.log(`Error creating data: ${err}`))
	// Por último nos desconectaremos de la DB.
  .finally(() => mongoose.disconnect());