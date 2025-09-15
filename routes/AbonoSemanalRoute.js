import express from 'express';
import {
  crearAbono,
  obtenerAbonos,
  obtenerAbonosPorPaciente,
  obtenerMisAbonos
} from '../controllers/AbonoSemanalController.js';

const router = express.Router();

router.post('/abonos', crearAbono);
router.get('/abonos', obtenerAbonos); 
router.get('/abonos/paciente/:id', obtenerAbonosPorPaciente); 
router.get('/abonos/mis-abonos', obtenerMisAbonos); 


export default router;
