import * as householdService from "../services/householdService.js";

export const getAllHouseholds = async (req, res) => {
  try {
    const households = await householdService.getAll(req.appId);
    res.json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHouseholdById = async (req, res) => {
  try {
    const household = await householdService.getById(req.params.id, req.appId);
    if (household) {
      res.json(household);
    } else {
      res.status(404).json({ message: "Domicílio não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHousehold = async (req, res) => {
  try {
    const newHousehold = await householdService.create(req.body, req.appId);
    res.status(201).json(newHousehold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateHousehold = async (req, res) => {
  try {
    const updatedHousehold = await householdService.update(
      req.params.id,
      req.body,
      req.appId
    );
    res.json(updatedHousehold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteHousehold = async (req, res) => {
  try {
    await householdService.remove(req.params.id, req.appId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNoteToHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberName, noteText, createdBy } = req.body;
    const files = req.files || [];

    const noteData = {
      memberName,
      noteText,
      files: files.map((file) => ({
        id: `${Date.now()}-${file.originalname}`,
        name: file.originalname,
        type: file.mimetype,
      })),
      createdBy: createdBy || "Usuário do Sistema",
    };

    const updatedHousehold = await householdService.addNote(
      id,
      noteData,
      req.appId
    );
    res.status(201).json(updatedHousehold);
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: `Erro ao adicionar anotação: ${error.message}` });
  }
};

export const deleteNoteFromHousehold = async (req, res) => {
  try {
    const { id, noteId } = req.params;
    const { deletedBy } = req.body;

    const updatedHousehold = await householdService.deleteNote(
      id,
      noteId,
      req.appId,
      deletedBy
    );
    res
      .status(200)
      .json({
        message: "Anotação excluída com sucesso!",
        household: updatedHousehold,
      });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: `Erro ao excluir anotação: ${error.message}` });
  }
};
