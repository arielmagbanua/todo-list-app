import express from "express";
const router = express.Router();
import User from "../models/user.js";
import bcrypt from "bcryptjs";

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  const result = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  return res.status(201).json(result);
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  let errorMessage = null;

  try {
    const user = await User.findById(id);
    if (user) {
      return res.json(user);
    }

    errorMessage = "User not found";
  } catch (error) {
    errorMessage = "User not found or invalid id.";
  }

  res.status(404).json({ error: errorMessage });
});

export default router;
