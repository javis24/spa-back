import express from 'express';
import { getCitas,
    getCitaById,    
    createCita,
    updateCita, 
    deleteCita
} from '../controllers/Citas.js';   

const router = express.Router();
// Rutas para citas
router.get('/citas', getCitas);
router.get('/citas/:id', getCitaById);
router.post('/citas', createCita);  
router.put('/citas/:id', updateCita);
router.delete('/citas/:id', deleteCita);

export default router;