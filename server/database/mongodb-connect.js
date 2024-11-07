import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export default function connect() {
  // get the database from .env
  const database = process.env.DB_CONNECTION;

  mongoose
    .connect(database, {
      dbName: "todos",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log(error);
    });
}
