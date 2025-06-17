import express from 'express';
// O nome do controller n�o muda, apenas as fun��es que ele exporta
import householdController from '../controllers/householdController.js';

const router = express.Router();

// Rotas para Domic�lios (CRUD Padr�o)
router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

// --- ROTAS DE ANOTA��ES CORRIGIDAS ---
// Agora, as anota��es s�o um sub-recurso de um domic�lio.

// POST /api/households/{householdId}/notes - Adiciona uma nota a um domic�lio espec�fico
router.post('/:householdId/notes', householdController.addNoteToHousehold);

// DELETE /api/households/{householdId}/notes/{noteId} - Deleta uma nota espec�fica de um domic�lio
router.delete('/:householdId/notes/:noteId', householdController.deleteNoteFromHousehold);

export default router;