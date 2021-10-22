const { createChat } = require('../controller/chat');

/** @module chat */
module.exports = (app, nextMain) => {

  app.post('/chat', createChat);

  return nextMain();
};