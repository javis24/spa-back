// controllers/MetricasSaludController.js
import MetricasSalud from "../models/MetricasSaludModel.js";
import Pacientes from "../models/PacienteModel.js";

// GET /metricas-salud
export const getMetricasSalud = async (req, res) => {
  try {
    let metricas;
    if (req.role === 'pacient') {
      metricas = await MetricasSalud.findAll({
        include: [{
          model: Pacientes,
          as: 'paciente',
          where: { userId: req.userId },
          attributes: ['uuid']
        }]
      });
    } else {
      metricas = await MetricasSalud.findAll({
        include: [{ model: Pacientes, as: 'paciente', attributes: ['uuid'] }]
      });
    }
    return res.status(200).json(metricas);
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// GET /metricas-salud/:id
export const getMetricasSaludById = async (req, res) => {
  try {
    const { id } = req.params;
    const metrica = await MetricasSalud.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!metrica) {
      return res.status(404).json({ msg: 'Métrica no encontrada' });
    }
    if (req.role === 'pacient' && metrica.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para ver esta métrica' });
    }
    return res.status(200).json(metrica);
  } catch (error) {
    console.error("Error al obtener métrica:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// POST /metricas-salud
export const createMetricasSalud = async (req, res) => {
  try {
    const { pacienteUuid, ...rest } = req.body;
    const paciente = await Pacientes.findOne({ where: { uuid: pacienteUuid } });
    if (!paciente) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }
    if (req.role === 'pacient' && paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para agregar métricas a este paciente' });
    }
    const nueva = await MetricasSalud.create({ pacienteUuid, ...rest });
    return res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear métrica:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// PUT /metricas-salud/:id
export const updateMetricasSalud = async (req, res) => {
  try {
    const { id } = req.params;
    const metrica = await MetricasSalud.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!metrica) {
      return res.status(404).json({ msg: 'Métrica no encontrada' });
    }
    if (req.role === 'pacient' && metrica.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para actualizar esta métrica' });
    }
    await MetricasSalud.update(req.body, { where: { id } });
    const actualizada = await MetricasSalud.findByPk(id);
    return res.status(200).json(actualizada);
  } catch (error) {
    console.error("Error al actualizar métrica:", error);
    return res.status(500).json({ msg: error.message });
  }
};

// DELETE /metricas-salud/:id
export const deleteMetricasSalud = async (req, res) => {
  try {
    const { id } = req.params;
    const metrica = await MetricasSalud.findByPk(id, {
      include: [{ model: Pacientes, as: 'paciente', attributes: ['userId'] }]
    });
    if (!metrica) {
      return res.status(404).json({ msg: 'Métrica no encontrada' });
    }
    if (req.role === 'pacient' && metrica.paciente.userId !== req.userId) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar esta métrica' });
    }
    await MetricasSalud.destroy({ where: { id } });
    return res.status(200).json({ msg: 'Métrica eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar métrica:", error);
    return res.status(500).json({ msg: error.message });
  }
};
