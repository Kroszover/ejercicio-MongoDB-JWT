import express, { json } from "express";
import { connect } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./User.js";

import expressJwt from "express-jwt";

const app = express();
app.use(json());

console.log(process.env.SECRET);

// Connect to MongoDB
(async () => {
  try {
    await connect(
      "mongodb+srv://admin:admin@cluster0.lmxotvy.mongodb.net/miapp?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
})();

const validateJwt = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
}); // Validar token
const signToken = (_id) => jwt.sign({ _id }, process.env.SECRET);

app.post("/register", async (req, res) => {
  const { body } = req;
  console.log({ body });
  try {
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const salt = await genSalt(10);
    const hashed = await hash(body.password, salt);

    const newUser = await User.create({
      email: body.email,
      password: hashed,
      name: body.name,
      lastname: body.lastname,
    });
    const signed = signToken(User._id);
    res.status(201).send({ newUser, signed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { body } = req;
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    } else {
      const validPassword = await compare(body.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        const signed = signToken(user._id);
        res.status(200).send({ user, signed });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const findAndAssingUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" }.end());
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAuthenticated = express.Router().use(validateJwt, findAndAssingUser);

app.get("/lele", isAuthenticated, (req, res) => {
  throw new Error("Error de prueba");
  res.send(req.user);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ "mi nuevo error": err.message });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send("Ha ocurrido un Error Aqui iria el html");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
