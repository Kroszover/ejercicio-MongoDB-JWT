import express from "express";
import { connect } from "mongoose";
import UserController from "./user.controller.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connect(
  "mongodb+srv://admin:admin@cluster0.lmxotvy.mongodb.net/miapp?retryWrites=true&w=majority"
);

//midleware
app.use(express.json());
app.use(express.static("public"));

/*app.get("/", UserController.list);
app.post("/", UserController.create);
app.get("/:id", UserController.get);
app.put("/:id", UserController.update);
app.patch("/:id", UserController.update);
app.delete("/:id", UserController.destroy);*/

app.get("/users", UserController.list);
app.post("/users", UserController.create);
app.get("/users/:id", UserController.get);
app.put("/users/:id", UserController.update);
app.patch("/users/:id", UserController.update);
app.delete("/users/:id", UserController.destroy);

app.get("/", (req, res) => {
  console.log(__dirname);
  res.sendFile(`${__dirname}/index.html`);
});

app.get("*", (req, res) => {
  res.status(404).send("Esta página no existe");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
