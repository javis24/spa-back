import express from 'express';
import { getPacientes, 
    getPacienteById, 
    createPaciente, 
    updatePaciente, 
    deletePaciente 
}   from '../controllers/Pacientes.js';    

import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();
// Rutas para pacientes
router.get('/pacientes', verifyUser, getPacientes);
router.get('/pacientes/:id', verifyUser, getPacienteById);  
router.post('/pacientes', verifyUser, createPaciente);
router.put('/pacientes/:id', verifyUser, updatePaciente);
router.delete('/pacientes/:id', verifyUser, deletePaciente);

export default router;