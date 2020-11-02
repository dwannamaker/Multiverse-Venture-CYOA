const mongoose = require("mongoose");

const connectionString =
  "mongodb://localhost:27017/multiverse_venture_cyoa_db";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(function () {
    console.log("Mongodb connected....");
  })
  .catch(function (error) {
    console.log("Mongodb connection err", error);
  });

mongoose.connection.on("disconnect", function (event) {
  console.log("mongodb disconnected", event);
});

module.exports = {
  Homepage: require("./Homepage"),
  Story: require("./Story"),
  User: require("./User"),
};
