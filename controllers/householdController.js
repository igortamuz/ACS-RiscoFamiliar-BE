import householdService from '../services/householdService.js';

const getAllHouseholds = (req, res) => {
    try {
        const households = householdService.getHouseholds(req.query);
        res.status(200).json(households);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHouseholdById = (req, res) => {
    try {
        const { id } = req.params;
        const { appId } = req.query;
        const household = householdService.getHouseholdById(id, appId);
        res.status(200).json(household);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createHousehold = (req, res) => {
    try {
        const { appId } = req.query;
        const newHousehold = householdService.addHousehold(req.body, appId);
        res.status(201).json(newHousehold);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateHousehold = (req, res) => {
    try {
        const { id } = req.params;
        const { appId } = req.query;
        const updatedHousehold = householdService.updateHousehold(id, req.body, appId);
        res.status(200).json(updatedHousehold);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteHousehold = (req, res) => {
    try {
        const { id } = req.params;
        const { appId } = req.query;
        householdService.deleteHousehold(id, appId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const addNoteToHousehold = (req, res) => {
    try {
        const { householdId } = req.params;
        const { appId } = req.query;
        const newNote = householdService.addMemberNote(householdId, req.body, appId);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteNoteFromHousehold = (req, res) => {
    try {
        const { householdId, noteId } = req.params;
        const { appId } = req.query;
        householdService.deleteMemberNote(householdId, noteId, appId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default {
    getAllHouseholds,
    getHouseholdById,
    createHousehold,
    updateHousehold,
    deleteHousehold,
    addNoteToHousehold,
    deleteNoteFromHousehold
};