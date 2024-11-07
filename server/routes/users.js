import express from "express";
const router = express.Router();
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import verifyToken from "../middlewares/auth.js";
import jwtConfig from "../config.js";
import jwt from "jsonwebtoken";

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  const result = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  return res.status(201).json(result);
});

router.get("/users/:id", verifyToken, async (req, res) => {
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

/**
 * This route authenticates the user
 */
router.post("/users/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user by email
    const user = await User.where({ email }).findOne();

    if (!user) {
      return res.status(401).json({ error: "Invalid user!" });
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
      return res.status(401).json({ error: "Unauthorized user!" });
    }

    // create auth token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtConfig.secret,
      {
        expiresIn: "1h",
      }
    );

    res.send({
      message: "Logged in successfully.",
      user_id: user.id,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Failed to create token for user!" });
  }
});

export default router;
