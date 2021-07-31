const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySqlStore = require("express-mysql-session");
const passport = require('passport');

const { database } = require("./keys");

//inicializaciones: inicializar el framework express y la base de datos
const app = express();
require('./lib/passport');

//configuraciones: las configuraciones que necesita el servidor por ej el puerto
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

//middlewares: son funciones que se ejecutan cada vez que un usuario manda una peticion al servidor
app.use(
  session({
    secret: "Maria",
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//variables globales: son las variables que toda la aplicacion necesita por variable para el nombre de la aplicacion que se pueda usar cualquier vista o archivo del servidor pueda acceder a esa variable
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

//rutas: se definen las URLs del servidor
app.use(require("./routes/index"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

//archivos publicos: archivos a los cuales el navegador puede acceder
app.use(express.static(path.join(__dirname, "public")));

// starting the server: esta seccion es para empezar el servidor
app.listen(app.get("port"), () => {
  console.log("Server on port ", app.get("port"));
});
