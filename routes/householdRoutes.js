import express from 'express';
// O nome do controller não muda, apenas as funções que ele exporta
import householdController from '../controllers/householdController.js';

const router = express.Router();

// Rotas para Domicílios (CRUD Padrão)
router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

// --- ROTAS DE ANOTAÇÕES CORRIGIDAS ---
// Agora, as anotações são um sub-recurso de um domicílio.

// POST /api/households/{householdId}/notes - Adiciona uma nota a um domicílio específico
router.post('/:householdId/notes', householdController.addNoteToHousehold);

// DELETE /api/households/{householdId}/notes/{noteId} - Deleta uma nota específica de um domicílio
router.delete('/:householdId/notes/:noteId', householdController.deleteNoteFromHousehold);

export default router;