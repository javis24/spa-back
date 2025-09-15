// controllers/PacienteController.js
import Pacientes from "../models/PacienteModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getPacientes = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "secretary") {
      response = await Pacientes.findAll({
        attributes: ['uuid', 'address', 'phoneNumber', 'email', 'evaluationDate', 'age', 'height'],
        include: [{
          model: User,
          as: 'usuarioAsignado',
          attributes: ['name', 'email']
        }]
      });
    } else {
      response = await Pacientes.findAll({
        attributes: ['uuid', 'address', 'phoneNumber', 'email', 'evaluationDate', 'age', 'height'],
        where: {
          userId: req.userId
        },
        include: [{
          model: User,
          as: 'usuarioAsignado',
          attributes: ['name', 'email']
        }]
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const getPacienteById = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Intentar por uuid del paciente
    let paciente = await Pacientes.findOne({ where: { uuid: id } });

    // 2. Si no lo encuentra, intenta por userId
    if (!paciente) {
      paciente = await Pacientes.findOne({ where: { userId: id } });
    }

    // 3. Si no se encontró con ninguna opción
    if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado" });

    // 4. Verificar permisos
    let response;
    if (req.role === "admin" || req.role === "secretary") {
      response = await Pacientes.findOne({
        attributes: ['uuid', 'address', 'phoneNumber', 'email', 'evaluationDate', 'age', 'height'],
        where: { id: paciente.id },
        include: [{
          model: User,
          as: 'creadoPor',
          attributes: ['name', 'email']
        }]
      });
    } else {
      // solo puede ver su propio paciente
      if (paciente.userId !== req.userId)
        return res.status(403).json({ msg: "No tienes permiso para ver este paciente" });

      response = await Pacientes.findOne({
        attributes: ['uuid', 'address', 'phoneNumber', 'email', 'evaluationDate', 'age', 'height'],
        where: {
          [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
        },
        include: [{
          model: User,
          as: 'creadoPor',
          attributes: ['name', 'email']
        }]
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en getPacienteById:", error);
    return res.status(500).json({ msg: error.message });
  }
};


export const createPaciente = async (req, res) => {
  const {
    address,
    phoneNumber,
    email,
    evaluationDate,
    age,
    height,
    unwantedGain,
    pathologies,
    lastActive,
    userId: customUserUuid // UUID opcional desde el frontend
  } = req.body;

  try {
    // Solo admin y secretary pueden crear pacientes
    if (req.role === "pacient") {
      return res.status(403).json({ msg: "No tienes permiso para crear pacientes" });
    }

    // UUID del usuario asociado (el suyo propio o uno especificado)
    const targetUserUuid = customUserUuid ?? req.userId;

    // Validar que el usuario exista
    const user = await User.findOne({ where: { uuid: targetUserUuid } });
    if (!user) {
      return res.status(404).json({ msg: "El usuario asociado no existe" });
    }

    // Verificar si ya existe un paciente con ese correo
    const existePaciente = await Pacientes.findOne({ where: { email } });
    if (existePaciente) {
      return res.status(400).json({ msg: "Este paciente ya está registrado" });
    }

    // Crear el paciente usando el ID del usuario
    const nuevo = await Pacientes.create({
      address,
      phoneNumber,
      email,
      evaluationDate,
      age,
      height,
      unwantedGain,
      pathologies,
      lastActive,
      userId: user.id // Usamos el ID real del modelo
    });

    res.status(201).json({ msg: "Paciente creado exitosamente", uuid: nuevo.uuid });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ msg: error.message });
  }
};



export const updatePaciente = async (req, res) => {
  try {
    const paciente = await Pacientes.findOne({
      where: { uuid: req.params.id }
    });

    if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado" });

    const {
      address,
      phoneNumber,
      email,
      evaluationDate,
      age,
      height,
      unwantedGain,
      pathologies,
      lastActive
    } = req.body;

    if (req.role === "admin" || req.role === "secretary") {
      await Pacientes.update({
        address, phoneNumber, email, evaluationDate,
        age, height, unwantedGain, pathologies, lastActive
      }, {
        where: { id: paciente.id }
      });
    } else {
      if (req.userId !== paciente.userId)
        return res.status(403).json({ msg: "Acceso denegado" });

      await Pacientes.update({
        address, phoneNumber, email, evaluationDate,
        age, height, unwantedGain, pathologies, lastActive
      }, {
        where: {
          [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
        }
      });
    }

    res.status(200).json({ msg: "Paciente actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const paciente = await Pacientes.findOne({
      where: { uuid: req.params.id }
    });

    if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado" });

    if (req.role === "admin" || req.role === "secretary") {
      await Pacientes.destroy({
        where: { id: paciente.id }
      });
    } else {
      if (req.userId !== paciente.userId)
        return res.status(403).json({ msg: "Acceso denegado" });

      await Pacientes.destroy({
        where: {
          [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
        }
      });
    }

    res.status(200).json({ msg: "Paciente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
