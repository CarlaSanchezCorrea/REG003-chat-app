const socketIO = require('socket.io');

const socketIoServer = socketIO.Server;

const disconnect = ( client, connectedUsers ) => {
    
  client.on('disconnect', () => {
    console.log('Usuario desconectado');
  })
  
  //connectedUsers.splice(connectedUsers.indexOf(client), 1);

}

const message = (client, socketIoServer ) => {
  console.log(socketIoServer)
  // client.on('message', (payload) => {
  //   console.log('Mensaje Recibido', payload)
  // } )

  client.on('sendMessage', (messageInfo) => {
    console.log('message: ' + messageInfo.text + client.decoded_token.name); //message: Hola Kathy Angular - recibido desde el FE
    client.broadcast.emit('receiveMessage', messageInfo); // mandado del BE hacia el FE
  });

}
module.export =  {
  disconnect,
  message
}
