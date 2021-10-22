const socketIO = require('socket.io');

const disconnect = ( client, connectedUsers ) => {
    
  client.on('disconnect', () => {
    console.log('Usuario desconectado');
  })
  
  //connectedUsers.splice(connectedUsers.indexOf(client), 1);

}
module.exports = {
  disconnect
}
