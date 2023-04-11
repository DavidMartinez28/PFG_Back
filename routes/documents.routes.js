const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { check, validationResult } = require("express-validator");


router.post('/upload', (req, res) =>{
  res.send({data:OK})
})