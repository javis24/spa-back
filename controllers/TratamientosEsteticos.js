// controllers/TratamientosEsteticosController.js
import TratamientosEsteticos from "../models/TratamientosEsteticosModel.js";
import Pacientes from "../models/PacienteModel.js";

// GET /tratamientos-esteticos
// controllers/TratamientosEsteticosController.js
export const getTratamientosEsteticos = async (req, res) => {
  try {
    const { pacienteUuid } = req.query;             // <<— NUEVO
    const where = {};
    if (pacienteUuid) where.pacienteUuid = pacienteUuid;

    let list;
    if (req.role === 'pacient') {
      list = await TratamientosEsteticos.findAll({
        where,                                       // <<— aplica filtro si viene
        include: [{
          model: Pacientes,
          as: 'paciente',
          where: { userId: req.userId },
          attributes: ['uuid']
        }]
      });
    } else {
      list = await TratamientosEsteticos.findAll({
        where,                                       // <<— aplica filtro si viene
        include: [{ model: Pacientes, as: 'paciente', attributes: ['uuid'] }]
      });
    }
    return res.status(200).json(list);
  } catch (error) {
    console.error("Error al obtener tratamientos:", error);
    return res.status(500).json({ msg: error.message });
  }
};


// GET /tratamientos-esteticos/:id
export const getTratamientosEsteticosById = async (req, res) => {
  try {
    const { id } = req.params;
    const tr = await TratamientosEsteticos.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!tr) {
      return res.status(404).json({ msg: 'Tratamiento no encontrado' });
    }
    if (req.role === 'pacient' && tr.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para ver este tratamiento' });
    }
    return res.status(200).json(tr);
  } catch (error) {
    console.error("Error al obtener tratamiento:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// POST /tratamientos-esteticos
export const createTratamientosEsteticos = async (req, res) => {
  try {
    const { pacienteUuid, ...rest } = req.body;
    const paciente = await Pacientes.findOne({ where: { uuid: pacienteUuid } });
    if (!paciente) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }
    if (req.role === 'pacient' && paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para agregar tratamientos a este paciente' });
    }
    const nueva = await TratamientosEsteticos.create({ pacienteUuid, ...rest });
    return res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear tratamiento:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// PUT /tratamientos-esteticos/:id
export const updateTratamientosEsteticos = async (req, res) => {
  try {
    const { id } = req.params;
    const tr = await TratamientosEsteticos.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!tr) {
      return res.status(404).json({ msg: 'Tratamiento no encontrado' });
    }
    if (req.role === 'pacient' && tr.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para actualizar este tratamiento' });
    }
    await TratamientosEsteticos.update(req.body, { where: { id } });
    const actual = await TratamientosEsteticos.findByPk(id);
    return res.status(200).json(actual);
  } catch (error) {
    console.error("Error al actualizar tratamiento:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// DELETE /tratamientos-esteticos/:id
export const deleteTratamientosEsteticos = async (req, res) => {
  try {
    const { id } = req.params;
    const tr = await TratamientosEsteticos.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!tr) {
      return res.status(404).json({ msg: 'Tratamiento no encontrado' });
    }
    if (req.role === 'pacient' && tr.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar este tratamiento' });
    }
    await TratamientosEsteticos.destroy({ where: { id } });
    return res.status(200).json({ msg: 'Tratamiento eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar tratamiento:", error);
    return res.status(500).json({ msg: error.message });
  }
};
