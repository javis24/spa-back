import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ msg: "¡Por favor, inicie sesión en su cuenta!" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  // Permitir acceso a admin o secretaria
  if (user.role !== "admin" && user.role !== "secretary") {
    return res.status(403).json({ msg: "Acceso prohibido" });
  }
  next();
};
