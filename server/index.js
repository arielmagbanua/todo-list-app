import express from "express";

import todosRouter, { something, somehow } from "./routes/todos.js";

const app = express();

const port = 4000;

console.log(something);
console.log(somehow);

app.get("/", (req, res) => {
  res.send("Hello Todo App!!!");
});

app.use("/api", todosRouter);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
