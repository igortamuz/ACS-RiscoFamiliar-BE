import express from 'express';
import householdController from '../controllers/householdController.js';

const router = express.Router();

router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

router.post('/:householdId/notes', householdController.addNoteToHousehold);

router.delete('/:householdId/notes/:noteId', householdController.deleteNoteFromHousehold);

export default router;