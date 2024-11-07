import jwt from "jsonwebtoken";
import jwtConfig from "../config.js";

export default function verifyToken(req, res, next) {
  // get the authorization header
  const authHeader = req.headers["authorization"];

  // Check if the header is present and properly formatted as "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).send("Access denied. No token provided.");
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token.");
    }

    req.user = decoded;
    next();
  });
}
