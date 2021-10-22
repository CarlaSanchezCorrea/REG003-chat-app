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
const socket = require('./sockets/socket');

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
let connectedUsers=[];

io.on('connection', (client) => { //on escucha eventos connection, 1 vez que hay respuesta del cb (socket), manejo esas asincronioas
  //  console.log('Nice BackEnd!', client.decoded_token.name);
  //   console.log('Conectado', client.id)

  connectedUsers.push(client.decoded_token.name);
  console.log(connectedUsers);

  client.emit("connectedUsers", connectedUsers)
  //++currentUsers
  //console.log(currentUsers)
  
  client.emit('status', 'Connected');
  const user = [];
  for (let[id, client] of io.of('/').sockets){
    user.push({
      userID: id ,
      username: client.decoded_token.name !== undefined ? client.decoded_token.name : 'Guest User: ' + id
    })
  }
  console.log(user)
  
  client.on('users', (users) => {
    console.log(users)
    users.forEach(user => {
      user.self = user.userID === client.id;
      initReactiveProperties(user);
    });
    this.users = users.sort((a,b) => {
      if(a.self) return -1;
      if(b.self) return 1 ;
      if(a.username < b.username) return -1;

      return a.username > b.username ? 1 : 0;
    })
  })

  // the server gets it as a chat message event
  client.on('sendMessage', (messageInfo) => {
    console.log('message: ' + messageInfo.text + client.decoded_token.name); //message: Hola Kathy Angular - recibido desde el FE
    client.broadcast.emit('receiveMessage', messageInfo); // mandado del BE hacia el FE
  });

<<<<<<< HEAD
  client.on('disconnect', () => {
    //--currentUsers
    console.log('Usuario desconectado', client.decoded_token.name);
  })
=======
  socket.disconnect(client, connectedUsers);
>>>>>>> c643a2996795863d0344302cb6669aa0db335f60
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