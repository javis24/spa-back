import express from 'express';
import { getTratamientosEsteticos,
    getTratamientosEsteticosById, 
    createTratamientosEsteticos,
    updateTratamientosEsteticos,  
    deleteTratamientosEsteticos
} from '../controllers/TratamientosEsteticos.js';

import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.use(verifyUser);

// Rutas para tratamientos estéticos
router.get('/tratamientos-esteticos', getTratamientosEsteticos);
router.get('/tratamientos-esteticos/:id', getTratamientosEsteticosById);
router.post('/tratamientos-esteticos', adminOnly, createTratamientosEsteticos);
router.put('/tratamientos-esteticos/:id', adminOnly, updateTratamientosEsteticos);
router.delete('/tratamientos-esteticos/:id', adminOnly, deleteTratamientosEsteticos);

export default router;