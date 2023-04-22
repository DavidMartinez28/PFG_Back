const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/Usuario");
const psicologoSchema = require("../models/Psicologos");
const pacienteSchema = require("../models/Pacientes");
const psicologoPacienteSchema = require("../models/PsicologoPaciente");
const filesSchema = require("../models/File");
const invitacionSchema = require("../models/Invitacion");
const sesionSchema = require("../models/Sesion");
const authorize = require("../utils/middlewares/auth");
const { check, validationResult } = require("express-validator");
const upload = require("../utils/middlewares/files.middleware");

// Sign-up
router.post(
  "/register-user",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password should be between 5 to 8 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 5, max: 8 }),
    check("type", "Tipo is required").not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userSchema({
          email: req.body.email,
          password: hash,
          type: req.body.type,
        });
        user
          .save()
          .then((response) => {
            if (req.body.type === "Psicologo") {
              const psicologo = new psicologoSchema({
                _id: response._id,
                fecha_nacimiento: req.body.fecha_nacimiento,
                name: req.body.name,
                email: req.body.email,
                descripcion: req.body.descripcion,
                telefono: req.body.telefono,
                sexo: req.body.sexo,
              });
              psicologo
                .save()
                .then(() => {
                  res.status(201).json({
                    message: "User successfully created!",
                    result: response,
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    error: error,
                  });
                });
            } else if (req.body.type === "Paciente") {
              const paciente = new pacienteSchema({
                _id: response._id,
                fecha_nacimiento: req.body.fecha_nacimiento,
                name: req.body.name,
                email: req.body.email,
                descripcion: req.body.descripcion,
                telefono: req.body.telefono,
                sexo: req.body.sexo,
              });
              paciente
                .save()
                .then(() => {
                  res.status(201).json({
                    message: "User successfully created!",
                    result: response,
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    error: error,
                  });
                });
            } else {
              res.status(201).json({
                message: "User successfully created!",
                result: response,
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      });
    }
  }
);

// Sign-in
router.post("/signin", async (req, res, next) => {
  try {
    const user = await userSchema.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Email not found",
      });
    }
    const response = await bcrypt.compare(req.body.password, user.password);

    if (!response) {
      return res.status(401).json({
        message: "Unknown password",
      });
    }
    let jwtToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "longer-secret-is-better",
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({
      token: jwtToken,
      expiresIn: 3600,
      _id: user._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
});

//Obtener  todos los pacientes
router.route("/pacientes").get(async (req, res) => {
  try {
    const response = await pacienteSchema.find().select("name email");
    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

//Obtener los pacientes que no estan invitados
router.route("/psicologo/:id/pacientes-invitables").get(async (req, res) => {
  try {
    const pacientesPsicologo = await psicologoPacienteSchema.find({
      id_psicologo: req.params.id,
    });
    const pacientesAsignados = pacientesPsicologo.map((p) => p.id_paciente);

    const invitacionesPendientes = await invitacionSchema
      .find({ id_psicologo: req.params.id, estado: "pendiente" })
      .select("id_paciente");
    const pacientesExcluidos = invitacionesPendientes.map((i) => i.id_paciente);

    const response = await pacienteSchema
      .find({
        _id: { $nin: pacientesAsignados },
        $or: [{ _id: { $nin: pacientesExcluidos } }],
      })
      .select("name email _id");

    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

//Obtener psicologo por id
router.get("/psicologo/:id", async (req, res, next) => {
  try {
    const psicologo = await psicologoSchema.findById(req.params.id).exec();
    if (!psicologo) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.status(200).json(psicologo);
  } catch (error) {
    return next(error);
  }
});

//Obtener paciente por id
router.get("/paciente/:id", async (req, res, next) => {
  try {
    const paciente = await pacienteSchema.findById(req.params.id).exec();
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.status(200).json(paciente);
  } catch (error) {
    return next(error);
  }
});

//obtener pacientes segun su psicologo
router.get("/psicologos/:id/pacientes", async (req, res) => {
  try {
    console.log(req.params.id);

    const pacientes = await psicologoPacienteSchema
      .find({ id_psicologo: req.params.id })
      .populate("id_paciente");
    res.json(pacientes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al obtener los pacientes.");
  }
});

//obtener psicologos segun el paciente
router.get("/pacientes/:id/psicologos", async (req, res) => {
  try {
    console.log(req.params.id);

    const psicologos = await psicologoPacienteSchema
      .find({ id_paciente: req.params.id })
      .populate("id_psicologo");
    res.json(psicologos);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al obtener los pacientes.");
  }
});

// Get Single User
router
  .route("/user-profile/:id")
  .get(authorize.isAuth, async (req, res, next) => {
    try {
      const user = await userSchema.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      let profile;
      if (user.type === "Psicologo") {
        profile = await psicologoSchema.findOne({ _id: user._id });
      } else if (user.type === "Paciente") {
        profile = await pacienteSchema.findOne({ _id: user._id });
      }

      res.status(200).json({
        user,
        profile,
      });
    } catch (error) {
      next(error);
    }
  });

// Update User
router.route("/update-user/:id").put(async (req, res, next) => {
  try {
    const data = await userSchema.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.json(data);
    console.log("User successfully updated!");
  } catch (error) {
    next(error);
  }
});

// Delete User
router.route("/delete-user/:id").delete(async (req, res, next) => {
  try {
    const deletedUser = await userSchema.findByIdAndRemove(req.params.id);
    res.status(200).json({
      msg: deletedUser,
    });
  } catch (error) {
    return next(error);
  }
});

//Subir archivo
router.post(
  "/upload",
  [upload.upload.single("myFile"), upload.uploadToCloudinary],
  async (req, res, next) => {
    try {
      const documentFile = req.file ? req.file.filename : null;
      // Crearemos una instancia de character con los datos enviados
      const newFile = new filesSchema({
        id_psicologo: req.body.id_psicologo,
        id_paciente: req.body.id_paciente,
        nameFile: documentFile,
        estado: req.body.estado,
        urlFile: req.file_url || null,
      });
      // Guardamos el personaje en la DB
      const createdFile = await newFile.save();
      return res.status(201).json(createdFile);
    } catch (error) {
      // Lanzamos la función next con el error para que lo gestione Express
      next(error);
    }
  }
);

//Obtener los documentos de un psicologo asignados a un paciente
router.get(
  "/psicologos/:id_psicologo/:id_paciente/documentos",
  async (req, res) => {
    try {
      console.log(req.params.id);

      const documentos = await filesSchema.find({
        id_psicologo: req.params.id_psicologo,
        id_paciente: req.params.id_paciente,
      });
      res.json(documentos);
    } catch (error) {
      console.log(error);
      res.status(500).send("Hubo un error al obtener los pacientes.");
    }
  }
);

//Crear invitacion
router.post("/invitaciones", async (req, res, next) => {
  try {
    const {
      id_psicologo,
      id_paciente,
      estado,
      paciente_nombre,
      psicologo_nombre,
    } = req.body;
    const invitacion = new invitacionSchema({
      id_psicologo,
      id_paciente,
      estado,
      paciente_nombre,
      psicologo_nombre,
    });
    const savedInvitacion = await invitacion.save();
    res.status(201).json(savedInvitacion);
  } catch (error) {
    return next(error);
  }
});

//Obtener las invitaciones de un psicologo
router.get("/psicologos/:id/invitaciones", async (req, res, next) => {
  try {
    const id_psicologo = req.params.id;
    const invitaciones = await invitacionSchema.find({
      id_psicologo: id_psicologo,
    });
    res.status(200).json(invitaciones);
  } catch (error) {
    return next(error);
  }
});

//Obtener las invitaciones de un paciente
router.get("/pacientes/:id/invitaciones", async (req, res, next) => {
  try {
    const id_paciente = req.params.id;
    const invitaciones = await invitacionSchema.find({
      id_paciente: id_paciente,
    });
    res.status(200).json(invitaciones);
  } catch (error) {
    return next(error);
  }
});

//Eliminar una invitacion
router.delete("/delete-invitaciones/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await invitacionSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Invitación eliminada" });
  } catch (error) {
    return next(error);
  }
});


//Crear relacion entre psicologo y paciente
router.post("/crear-relacion", async (req, res, next) => {
  try {
    const {
      id_psicologo,
      id_paciente,
    } = req.body;

    const relacion = new psicologoPacienteSchema({
      id_psicologo,
      id_paciente,
    });

    const savedRelacion = await relacion.save();
    res.status(201).json(savedRelacion);
  } catch (error) {
    return next(error);
  }
});

//Crear sesion
router.post('/create-sesion', async (req, res, next) => {
  try {
    const { fecha, id_psicologo, id_paciente, estado, nombrePaciente, nombrePsicologo } = req.body;
    const sesion = new sesionSchema({
      fecha,
      id_psicologo,
      id_paciente,
      estado,
      nombrePaciente,
      nombrePsicologo

    });
    const savedSesion = await sesion.save();
    res.status(201).json(savedSesion);
  } catch (error) {
    return next(error);
  }
});
  
module.exports = router;
