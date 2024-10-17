import mongoose from "mongoose";

export default function connect() {
  const database =
    "mongodb+srv://magbanuacariel:oN0MCAi81iEyMPRd@todocluster.iu0z4.mongodb.net/?retryWrites=true&w=majority&appName=TodoCluster";
  mongoose
    .connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "todos",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log(error);
    });
}
