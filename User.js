import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 20 }, // Corrección: lowercase opciones
  lastname: { type: String, required: true, minlength: 3, maxlength: 20 }, // Corrección: lowercase opciones
  email: { type: String, required: true, minlength: 5, maxlength: 50 }, // Corrección: lowercase opciones
  password: { type: String, required: true, minlength: 5, maxlength: 500 }, // Corrección: lowercase opciones
});

const User = model("User", userSchema);

export default User;
