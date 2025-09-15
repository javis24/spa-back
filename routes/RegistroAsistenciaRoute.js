import express from 'express';
import { registrarEntrada, registrarSalida, getRegistros } from '../controllers/RegistroAsistenciaController.js';

const router = express.Router();

router.post('/asistencia/entrada', registrarEntrada);
router.post('/asistencia/salida', registrarSalida);
router.get('/asistencia', getRegistros);

export default router;
