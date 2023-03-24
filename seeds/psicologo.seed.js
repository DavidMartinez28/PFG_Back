const mongoose = require('mongoose');

// Imporatmos el modelo Pet en este nuevo archivo.
const Psicologos = require('../models/Psicologos');

const psicologos = [
  {
    fecha_nacimiento: new Date ('1991-04-16'),
    name: 'Luis Martinez',
    correo: 'luis@gmail.com',
    descripcion: 'Psicólogo especializado en psicología clínica',
    telefono: 634876194,
    sexo: 'Masculino',
  },
  {
    fecha_nacimiento: new Date ('1998-07-12'),
    name: 'Andrea Sanz',
    correo: 'andrea@gmail.com',
    descripcion: 'Psicóloga especializada en psicología social',
    telefono: 653278102,
    sexo: 'Femenino',
  },
];

const psicologosDocuments = psicologos.map(psicologos => new Psicologos(psicologos));

mongoose
  .connect('mongodb+srv://davidmg2841:Escalada28@cluster0.swgeflz.mongodb.net/PFG?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
		// Utilizando Character.find() obtendremos un array con todos los personajes de la db
    const allPsicologos = await Psicologos.find();
		
		// Si existen personajes previamente, dropearemos la colección
    if (allPsicologos.length) {
      await Psicologos.collection.drop(); //La función drop borra la colección
    }
  })
  .catch((err) => console.log(`Error deleting data: ${err}`))
  .then(async () => {
		// Una vez vaciada la db de los personajes, usaremos el array characterDocuments
		// para llenar nuestra base de datos con todas los personajes.
		await Psicologos.insertMany(psicologosDocuments);
	})
  .catch((err) => console.log(`Error creating data: ${err}`))
	// Por último nos desconectaremos de la DB.
  .finally(() => mongoose.disconnect());