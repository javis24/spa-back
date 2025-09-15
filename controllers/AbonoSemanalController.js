import AbonoSemanal from "../models/AbonoSemanalModel.js";
import User from "../models/UserModel.js";

// Crear abono semanal
export const crearAbono = async (req, res) => {
  const { monto, semana, userId: userIdBody } = req.body;
  const sessionUserId = req.session.userId;
  const userId = userIdBody || sessionUserId;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    if (!userIdBody && user.role !== 'pacient') {
      return res.status(403).json({ msg: 'Acceso denegado, solo pacientes pueden abonar' });
    }

    const nuevoAbono = await AbonoSemanal.create({ userId, monto, semana });
    res.status(201).json(nuevoAbono);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener todos los abonos (admin o secretaria), incluyendo datos del usuario
export const obtenerAbonos = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.session.userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'secretary')) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const abonos = await AbonoSemanal.findAll({
      include: {
        model: User,
        attributes: ['uuid', 'name', 'email']
      },
      order: [['semana', 'ASC']]
    });
    res.status(200).json(abonos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener abonos de un paciente específico (admin o secretaria)
export const obtenerAbonosPorPaciente = async (req, res) => {
  const pacienteId = req.params.id;

  try {
    const user = await User.findOne({ where: { uuid: req.session.userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'secretary')) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const abonos = await AbonoSemanal.findAll({
      where: { userId: pacienteId },
      include: {
        model: User,
        attributes: ['uuid', 'name', 'email']
      },
      order: [['semana', 'ASC']]
    });

    res.status(200).json(abonos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Obtener abonos del paciente autenticado
export const obtenerMisAbonos = async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await User.findOne({ where: { uuid: userId } });
    if (!user || user.role !== 'pacient') {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const abonos = await AbonoSemanal.findAll({
      where: { userId: user.id },
      include: {
        model: User,
        attributes: ['uuid', 'name', 'email']
      },
      order: [['semana', 'ASC']]
    });

    res.status(200).json(abonos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
