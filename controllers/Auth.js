import User from "../models/UserModel.js";
import argon2 from "argon2";

// Iniciar sesión
export const Login = async (req, res) => {

  
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });



    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

    req.session.userId = user.uuid;

    const { uuid, name, email, role } = user;
    res.status(200).json({ uuid, name, email, role });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
  }
};

// Obtener usuario autenticado
export const Me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Por favor, inicie sesión" });
    }

    const user = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: { uuid: req.session.userId },
    });

    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuario", error: error.message });
  }
};

// Cerrar sesión
export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "No se pudo cerrar sesión" });
    res.status(200).json({ msg: "Sesión cerrada exitosamente" });
  });
};
