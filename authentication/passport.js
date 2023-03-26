const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  "register", // Nombre de la estrategia, en este caso será register
  new LocalStrategy(
    {
      usernameField: "email", // Elegimos el campo email del req.body
      passwordField: "password", // Elegimos el campo password del req.body
      passReqToCallback: true, // Hace que el callback reciba la Request (req)
    },
    async (req, email, password, done) => {
      try {
        // Primero buscamos si el usuario existe en nuestra DB
        const previousUser = await User.findOne({ email: email });

        // Si hay usuario previamente, lanzamos un error
        if (previousUser) {
          const error = new Error("The user is already registered!");
          return done(error);
        }

        // Si no existe el usuario, vamos a "hashear" el password antes de registrarlo
        const pwdHash = await bcrypt.hash(password, saltRounds);

        // Creamos el nuevo user y lo guardamos en la DB
        const newUser = new User({
          email: email,
          password: pwdHash,
        });

        const savedUser = await newUser.save();

        // Invocamos el callback con null donde iría el error y el usuario creado
        done(null, savedUser);
      } catch (error) {
        // Si hay un error, resolvemos el callback con el error
        return done(error);
      }
    }
  )
);
