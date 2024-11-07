import express from "express";
const router = express.Router();
import Todo from "../models/Todo.js";
import verifyToken from "../middlewares/auth.js";

router.get("/todos/:userId", verifyToken, async (req, res) => {
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

router.post("/todos/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const { title, description } = req.body;

  try {
    const newTodo = new Todo({
      userId: userId,
      title,
      description,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating todo.", error });
  }
});

router.delete("/todos/:todoId", verifyToken, async (req, res) => {
  const todoId = req.params.todoId;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
});

router.put("/todos/:userId/:todoId", async (req, res) => {
  const userId = req.params.userId;
  const todoId = req.params.todoId;
  const { title, description } = req.body;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: userId },
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo.", error });
  }
});

export default router;
