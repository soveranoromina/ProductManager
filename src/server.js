import express from "express";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import productRouter from "./routes/ProductRouter.js";
import cartRouter from "./routes/CartRouter.js";
import viewRouter from "./routes/ViewRouter.js"
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import path from 'path'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${process.cwd()}/src/public`));


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use(errorHandler);

app.engine('handlebars', handlebars.engine());
app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", 'handlebars');
app.use('/views', viewRouter);

const httpServer =  app.listen(8080, () => console.log("Servidor escuchando en el puerto 8080"));

/* ------------------------------- Web socket ------------------------------- */
const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

socketServer.on("connection", (socket) => {
  console.log(`Usuario conectado ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("usuario desconectado");
  });

  socket.emit('saludoDesdeBack', 'Bienvenido a realTimeProducts') 
  socket.on('respuestaDesdeFront', (message)=>{
    console.log(message);
  })

});