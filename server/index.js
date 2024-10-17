import express from "express";
import connect from "./database/mongodb-connect.js";

import todosRouter from "./routes/todos.js";
import usersRouter from "./routes/users.js";

const app = express();

const port = 4000;

// Use body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use the static middleware to serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello Todo App!!!");
});

app.use("/api", todosRouter);
app.use("/api", usersRouter);

// attempt connection to mongodb
connect();

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
