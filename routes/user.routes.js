const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/Usuario");
const psicologoSchema = require("../models/Psicologos");
const pacienteSchema = require("../models/Pacientes");
const psicologoPacienteSchema = require("../models/PsicologoPaciente");
const authorize = require("../utils/middlewares/auth");
const { check, validationResult } = require("express-validator");

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
        expiresIn: "1h",
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

// obtener pacientes
router.route("/pacientes").get(async (req, res) => {
  try {
    const response = await pacienteSchema.find().exec();
    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

//obtener pacientes segun su psicologo
router.get('/psicologos/:id/pacientes', async (req, res) => {
  try {
    console.log(req.params.id);
    
    const pacientes = await psicologoPacienteSchema.find({id_psicologo: req.params.id}).populate('id_paciente');
    res.json(pacientes);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error al obtener los pacientes.');
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


module.exports = router;
