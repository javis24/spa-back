import express from 'express';
import { getMetricasSalud,
    getMetricasSaludById,
    createMetricasSalud,
    updateMetricasSalud,
    deleteMetricasSalud
} from '../controllers/MetricasSalud.js';

const router = express.Router();
// Rutas para métricas de salud
router.get('/metricas-salud', getMetricasSalud);
router.get('/metricas-salud/:id', getMetricasSaludById);
router.post('/metricas-salud', createMetricasSalud);    
router.put('/metricas-salud/:id', updateMetricasSalud);
router.delete('/metricas-salud/:id', deleteMetricasSalud);

export default router;