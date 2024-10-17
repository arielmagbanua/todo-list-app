import { Schema, model } from "mongoose";

// create the schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// create the model
const User = model("User", userSchema);

// export the model
export default User;
