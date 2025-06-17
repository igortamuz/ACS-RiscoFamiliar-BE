const householdService = require('../services/householdService');

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
        const success = householdService.deleteHousehold(id, appId);
        if (success) {
            res.status(204).send();
        } else {
            throw new Error('Erro ao deletar domicílio.');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const addNoteToMember = (req, res) => {
    try {
        const { id } = req.params;
        const { appId } = req.query;
        const newNote = householdService.addMemberNote(id, req.body, appId);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteNoteFromMember = (req, res) => {
    try {
        const { id, noteId } = req.params;
        const { appId } = req.query;
        const success = householdService.deleteMemberNote(id, noteId, appId);
        if (success) {
            res.status(204).send();
        } else {
            throw new Error('Anotação não encontrada.');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    getAllHouseholds,
    getHouseholdById,
    createHousehold,
    updateHousehold,
    deleteHousehold,
    addNoteToMember,
    deleteNoteFromMember
};