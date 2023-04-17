const jwt = require("jsonwebtoken")

const isAuth = (req, res, next) => {
    
    const authorization = req.headers.authorization //si en el header existe authorization lo guardamos en una variable. 
//Esta tiene el formato: bearer token
    
    if(!authorization){ //Se comprueba que exista autorización
        return res.json({
            status: 401,
            message: "Unauthorized",
            data: null
        })
    }
 
    const splits = authorization.split(" ")//troceamos el token en dos partes
//en la primera quitamos la palabra Bearer
    if( splits.length!=2 || splits[0]!="Bearer"){ //
        return res.json({
            status: 400,
            message: "Bad Request",
            data: null
        })
    }

    const jwtString = splits[1] // En esta variable guardamos la parte que contiene la información del token
    
    try{
        var token = jwt.verify(jwtString, "longer-secret-is-better"); //verificamos que el token tiene una firma correcta

    } catch(err){
        return next(err)
    }

    const authority = { //Creamos un objeto authority que contienen la informacion del token, 
//en este caso el id y el email del usuario
        userId   : token.userId,
        email : token.email
    }
    //Asignamos al request el objeto authority
    req.authority = authority
    next()
}

module.exports = { //exportamos la funcion isAuth
    isAuth,
}