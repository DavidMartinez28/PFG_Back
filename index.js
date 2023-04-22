const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const api=  require('./routes/user.routes');
require('./utils/db');


const PORT = process.env.PORT || 400;
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(cors());



// Aquí indicamos las rutas a usar
server.use('/public', express.static('public'));

server.use('/api', api);

const router = express.Router();

server.use('/', router);


server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

server.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

server.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});