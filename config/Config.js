const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose
    .connect(process.env.URL, {
      dbName: process.env.DB,
    })
    .then(() => {
      console.log("Connected DB");
    })
    .catch((error) => {
      console.log("Unconnected DB,", error);
      process.exit(1);
    });
};

module.exports = ConnectDB;
