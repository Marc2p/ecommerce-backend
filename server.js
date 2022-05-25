const dotenv = require("dotenv").config();
const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
require("./src/mongodb/mongooseLoader");
const PORT = process.env.PORT || 8080;
const logger = require("./src/utils/logger");

const session = require("express-session");
const passport = require("passport");
const passportStrategy = require("./src/utils/passport");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');

const clusterMode = false;
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const errorHandler = require("./src/middlewares/errorHandler");
const notFound = require("./src/middlewares/notFound");

const apiProductos = require("./src/routes/productos");
const apiCarritos = require("./src/routes/carritos");
const login = require("./src/routes/login");
const logout = require("./src/routes/logout");
const register = require("./src/routes/register");
const Chat = require("./src/daos/chat");
let chat = new Chat();

if (cluster.isMaster && clusterMode) {
  logger.info(`PID MASTER ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    logger.info("Worker", worker.process.pid, "died", new Date().toLocaleString());
    cluster.fork();
  })
}
else {

  app.use(express.static("./public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: "AlckejcUi5Jnm3rFhNjUil87",
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 600000,
        autoRemove: "native",
      }),
      cookie: {
        maxAge: 600000
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  io.on("connection", async (socket) => {
    logger.info("Un cliente se ha conectado");
    const messages = await chat.getMessages().then((res) => res);
    socket.emit("messages", messages);
    socket.on("new-message", async (data) => {
      await chat.saveMessages(data).then((resolve) => resolve);
      const messages = await chat.getMessages().then((resolve) => resolve);
      io.sockets.emit("messages", messages);
    });
  });

  app.use("/api/productos", apiProductos);
  app.use("/api/carrito", apiCarritos);
  app.use("/api", login);
  app.use("/api", register);
  app.use("/api", logout);

  app.use(errorHandler);
  app.use(notFound);

  const srv = server.listen(PORT, () => {
    logger.info(`(Pid: ${process.pid}) Servidor Express escuchando peticiones en el puerto ${srv.address().port}`);
  });
  srv.on("error", (error) => logger.error(`Error en servidor ${error}`));
}