import { User } from "./User.js";

const UserController = {
  get: async (req, res) => {
    res.status(200).send("este es un usuario");
  },
  list: async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
  },

  create: async (req, res) => {
    const user = new User({
      name: req.body.name,
      edad: req.body.edad,
    });
    const savedUser = await user.save();
    console.log(savedUser);
    res.status(200).send("usuario creado");
  },

  update: async (req, res) => {
    const user = await User.findOne({ username: "mario" });
    const nuevoDatos = req.body;
    user.edad = nuevoDatos.edad;
    const userActualizado = await user.save();
    console.log(userActualizado);
    res.status(200).send("usuario modificado");
  },

  destroy: async (req, res) => {
    const user = await User.findOne({ username: "mario" });
    await user.remove();
    res.status(200).send("Usuario Eliminado");
  },
};

export default UserController;
