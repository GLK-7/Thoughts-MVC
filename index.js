const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const conn = require("./db/conn");
const app = express();

// Models
const Thought = require("./models/Thought");
const User = require("./models/User");

// Import Routes
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// Import Controllers
const ThoughtController = require("./controllers/ThoughtController"); // Para acessar a barra da aplicação

// Definindo a Engine como Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Session middleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000, // equivale a um dia de expiração
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

// Configurando as flash messages
app.use(flash());

// public path
app.use(express.static("public"));

// Salvando a sessão no res
app.use((req, res, next) => {
  // console.log(req.session)
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

// Routes
app.use("/thoughts", thoughtsRoutes);
app.use("/", authRoutes);

app.get("/", ThoughtController.showThoughts);

// Execução do App
conn
  .sync()
  .then(() => {
    app.listen(3000);
    console.log("App rodando!");
  })
  .catch((e) => console.log(e));
