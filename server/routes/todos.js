import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

router.get("/todos", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const todoId = req.query.id;

  try {
    if (todoId) {
      const todo = await Todo.findOne({ _id: todoId, userId: userId });
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.json(todo);
    } else {
      const todos = await Todo.find({ userId: userId });
      res.json(todos);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
});

router.get("/todos/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  res.send(`Getting TODO with id ${id}`);
});

router.post("/todos", (req, res) => {
  res.send({ id: 1, title: "Todo", description: "My todo" });
});

router.put("/todos/:id", (req, res) => {
  const id = req.params.id;

  res.send(`Updating TODO with id ${id}`);
});

router.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  res.send(`Deleting TODO with id ${id}`);
});

export default router;
