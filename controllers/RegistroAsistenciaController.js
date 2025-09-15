import RegistroAsistencia from '../models/RegistroAsistenciaModel.js';
import User from '../models/UserModel.js';

export const registrarEntrada = async (req, res) => {
  try {
    const { userId } = req.body;
    const fechaHoy = new Date().toISOString().split('T')[0];

    // Verificar si ya hay registro hoy
    const yaExiste = await RegistroAsistencia.findOne({
      where: { userId, fecha: fechaHoy }
    });

    if (yaExiste) {
      return res.status(400).json({ msg: 'Ya se ha registrado la entrada hoy' });
    }

    const nuevo = await RegistroAsistencia.create({
      userId,
      fecha: fechaHoy,
      horaEntrada: new Date().toLocaleTimeString('en-US', { hour12: false })
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const registrarSalida = async (req, res) => {
  try {
    const { userId } = req.body;
    const fechaHoy = new Date().toISOString().split('T')[0];

    const registro = await RegistroAsistencia.findOne({
      where: { userId, fecha: fechaHoy }
    });

    if (!registro) {
      return res.status(404).json({ msg: 'No se ha registrado la entrada hoy' });
    }

    registro.horaSalida = new Date().toLocaleTimeString('en-US', { hour12: false });
    await registro.save();

    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRegistros = async (req, res) => {
  try {
    const registros = await RegistroAsistencia.findAll({
      include: {
        model: User,
        attributes: ['uuid', 'name', 'email']
      }
    });
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
