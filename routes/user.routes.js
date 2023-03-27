const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/Usuario");
const authorize = require("../utils/middlewares/auth");
const { check, validationResult } = require('express-validator');

// Sign-up
router.post("/register-user",
    [
        
        check('email', 'Email is required')
            .not()
            .isEmpty(),
        check('password', 'Password should be between 5 to 8 characters long')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 8 }),
        check('tipo', 'Tipo is required')
            .not()
            .isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    email: req.body.email,
                    password: hash,
                    tipo: req.body.tipo
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: "User successfully created!",
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
            });
        }
    });


// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
});

// Get Users
router.route('/').get(async (req, res) => {
    try {
        const response = await userSchema.find().exec();
        res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
});

// Get Single User
router.route('/user-profile/:id').get(async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }
    res.status(200).json({
      msg: user
    });
  } catch (error) {
    next(error);
  }
});

// Update User
router.route('/update-user/:id').put(async (req, res, next) => {
    try {
      const data = await userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.json(data);
      console.log('User successfully updated!');
    } catch (error) {
      next(error);
    }
  });


// Delete User
router.route('/delete-user/:id').delete(async (req, res, next) => {
    try {
        const deletedUser = await userSchema.findByIdAndRemove(req.params.id);
        res.status(200).json({
            msg: deletedUser
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;