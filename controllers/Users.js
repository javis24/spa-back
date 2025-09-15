import User from "../models/UserModel.js";
import argon2 from "argon2";


export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
         attributes: ['uuid', 'name', 'email', 'role'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}



export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (!name || !email || !password || !confPassword || !role) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  }

  const hashPassword = await argon2.hash(password);

  try {
    await User.create({
      name,
      email,
      password: hashPassword,
      role
    });
    res.status(201).json({ msg: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("ERROR DETALLE:", error);
    res.status(400).json({ msg: error.message, error });
  }
}



export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "Usuario no encontrado"});
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password;
    }   else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) 
        return res.status(400).json({ msg: "Las contraseñas no coinciden" });
        try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "Usuario actualizado exitosamente"});
    
} catch (error) {
        res.status(400).json({msg: error.message});
    }
}


export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "Usuario no encontrado"});
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "Usuario eliminado exitosamente"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}