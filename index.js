const express = require('express');
const cors = require('cors');
const config = require('./global/config');
const pkg = require('./package.json')
const routes = require('./routes');
const errorHandler = require('./middlewares/errors');
const app = express();
const http = require('http'); 
const server = http.createServer(app);
const { portBE, portFE } = config;
const socketioJwt = require('socketio-jwt');

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(authMiddleware(secret)); -ERROR

const io = require('socket.io')(server, {
  cors:{
    origin: [portFE],
    credentials: true,
    methods: ["GET", "POST"] //son los metodos que usa internamente socke.io
  }
})

io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));
  

/* socket */
//let currentUsers = 0;
io.on('connection', (client) => { //on escucha eventos connection, 1 vez que hay respuesta del cb (socket), manejo esas asincronioas
 // console.log('Nuevo usuario conectado',  client.handshake.headers.authorization );
 console.log('Nice BackEnd!', client.decoded_token.name);
 // console.log(client, 'connected Kathy :3');
  console.log('Conectado', client.id)
  //++currentUsers
  // the server gets it as a chat message event
  client.on('sendMessage', (messageInfo) => {
    console.log('message: ' + messageInfo.text + client.decoded_token.name); //message: Hola Kathy Angular - recibido desde el FE
    client.broadcast.emit('receiveMessage', messageInfo); // mandado del BE hacia el FE
    // socket.emit ("testing Kathy")
  });

  client.on('disconnect', () => {
    //--currentUsers
    console.log('Usuario desconectado', client.decoded_token.name);
  })
});

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  server.listen(portBE, () => {
    console.log(`App listening on port ${portBE} =D`);
  });
});