const { default: mongoose } = require("mongoose");

function connectDb() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`MongoDb connected Successfully`);
    })
    .catch((error) => {
      console.log(`Error in connection database : ${error?.message}`);
    });
}

module.exports = connectDb;
