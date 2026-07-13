const { FileStore } = require("./fileStore");

const createStore = function () {
  if (process.env.ENGAGEMENT_STORAGE_CONNECTION_STRING) {
    const { TableStore } = require("./tableStore");
    return new TableStore(process.env.ENGAGEMENT_STORAGE_CONNECTION_STRING);
  }

  return new FileStore();
};

module.exports = { createStore };
