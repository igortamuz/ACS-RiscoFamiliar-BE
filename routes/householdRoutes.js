import express from 'express';
import householdController from '../controllers/householdController.js'; 

const router = express.Router();

router.get('/', householdController.getAllHouseholds);
router.post('/', householdController.createHousehold);
router.get('/:id', householdController.getHouseholdById);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);
router.post('/:id/notes', householdController.addNoteToMember);
router.delete('/:id/notes/:noteId', householdController.deleteNoteFromMember);

export default router;