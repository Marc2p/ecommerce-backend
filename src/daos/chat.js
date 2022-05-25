const logger = require('../utils/logger');
const chatModel = require("../models/chat");

class Chat {
  constructor() {}
  
  async getMessages() {
    try {
      const messages = await chatModel.find();
      if (!messages) {
        throw new Error("No hay mensajes");
      }
      return messages;
    } catch (error) {
      logger.warn(error);
    }
  }
  
  async saveMessages(obj) {
    try {
      const chatSaveModel = new chatModel(obj);
      const savedMessage = await chatModel.insertMany(chatSaveModel).then((message) => message).catch((err) => {
        throw new Error(err);
      });
      return savedMessage;
    } catch (error) {
      logger.warn(error);
    }
  }
}

module.exports = Chat;
