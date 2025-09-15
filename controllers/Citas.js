// controllers/CitaController.js
import Cita from "../models/CitasModel.js";
import User from "../models/UserModel.js";

// Include de usuario creador
const includeUsuario = {
  model: User,
  as: 'usuario',
  attributes: ['name', 'email']
};

// GET /citas
export const getCitas = async (req, res) => {
  try {
    const query = {
      attributes: ['id', 'pacienteUuid', 'fecha', 'hora', 'servicio', 'comentario', 'userId', 'createdAt'],
      include: [ includeUsuario ]
    };

    // Si es pacient, solo sus propias citas
    if (req.role === 'pacient') {
      query.where = { userId: req.userId };
    }

    const citas = await Cita.findAll(query);
    return res.status(200).json(citas);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// GET /citas/:id
export const getCitaById = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findByPk(id, {
      attributes: ['id', 'pacienteUuid', 'fecha', 'hora', 'servicio', 'comentario', 'userId', 'createdAt'],
      include: [ includeUsuario ]
    });

    if (!cita) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }
    if (req.role === 'pacient' && cita.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para ver esta cita' });
    }

    return res.status(200).json(cita);
  } catch (error) {
    console.error("Error al obtener cita:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// POST /citas
export const createCita = async (req, res) => {
  try {
    const { pacienteUuid, fecha, hora, servicio, comentario } = req.body;

    // Si quisieras validar paciente, hazlo aquí.

    // Siempre asignamos el userId desde el token
    const nueva = await Cita.create({
      pacienteUuid,
      fecha,
      hora,
      servicio,
      comentario,
      userId: req.userId
    });

    // Opcional: recargar con includeUsuario
    const citaCreada = await Cita.findByPk(nueva.id, { include: [ includeUsuario ] });
    return res.status(201).json(citaCreada);
  } catch (error) {
    console.error("Error al crear cita:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// PUT /citas/:id
export const updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }
    if (req.role === 'pacient' && cita.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para actualizar esta cita' });
    }

    const { fecha, hora, servicio, comentario } = req.body;
    await Cita.update(
      { fecha, hora, servicio, comentario },
      { where: { id } }
    );

    const actualizada = await Cita.findByPk(id, { include: [ includeUsuario ] });
    return res.status(200).json(actualizada);
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// DELETE /citas/:id
export const deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }
    if (req.role === 'pacient' && cita.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar esta cita' });
    }

    await Cita.destroy({ where: { id } });
    return res.status(200).json({ msg: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return res.status(500).json({ msg: error.message });
  }
};
