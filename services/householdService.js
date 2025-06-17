import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilePath = (appId) => {
  const city = appId === "IMP" ? "imperatriz" : "curitiba";
  return path.join(__dirname, `../data/households_${city}.json`);
};

const readData = async (appId) => {
  const filePath = getFilePath(appId);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeData = async (appId, data) => {
  const filePath = getFilePath(appId);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export const getAll = async (appId) => readData(appId);

export const getById = async (id, appId) => {
  const households = await readData(appId);
  return households.find((h) => h.id === id);
};

export const create = async (data, appId) => {
  const households = await readData(appId);
  const newHousehold = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    history: [
      {
        date: new Date().toISOString(),
        changedBy: "Usuário do Sistema",
        changeType: "Criado",
        change: "Domicílio criado.",
      },
    ],
    memberNotes: [],
  };
  households.push(newHousehold);
  await writeData(appId, households);
  return newHousehold;
};

export const update = async (id, data, appId) => {
  const households = await readData(appId);
  const index = households.findIndex((h) => h.id === id);
  if (index > -1) {
    const originalHousehold = households[index];
    households[index] = {
      ...originalHousehold,
      ...data,
      lastUpdatedAt: new Date().toISOString(),
    };

    if (!households[index].history) households[index].history = [];
    households[index].history.push({
      date: new Date().toISOString(),
      changedBy: "Usuário do Sistema",
      changeType: "Alterado",
      change: "Dados do domicílio foram atualizados.",
    });

    await writeData(appId, households);
    return households[index];
  }
  return null;
};

export const remove = async (id, appId) => {
  let households = await readData(appId);
  const initialLength = households.length;
  households = households.filter((h) => h.id !== id);
  if (households.length === initialLength) {
    throw new Error("Domicílio não encontrado para exclusão.");
  }
  await writeData(appId, households);
};

export const addNote = async (householdId, noteData, appId) => {
  const households = await readData(appId);
  const householdIndex = households.findIndex((h) => h.id === householdId);

  if (householdIndex === -1) {
    throw new Error("Domicílio não encontrado.");
  }

  const household = households[householdIndex];

  if (!household.memberNotes) {
    household.memberNotes = [];
  }

  const newNote = {
    id: uuidv4(),
    memberName: noteData.memberName,
    note: noteData.noteText,
    files: noteData.files,
    createdBy: noteData.createdBy,
    createdAt: new Date().toISOString(),
  };

  household.memberNotes.push(newNote);

  if (!household.history) {
    household.history = [];
  }
  household.history.push({
    date: new Date().toISOString(),
    changedBy: noteData.createdBy,
    changeType: "Adicionado",
    change: `Anotação para "${noteData.memberName}" foi adicionada.`,
  });

  household.lastUpdatedAt = new Date().toISOString();
  households[householdIndex] = household;
  await writeData(appId, households);

  return household;
};

export const deleteNote = async (
  householdId,
  noteId,
  appId,
  deletedBy = "Usuário do Sistema"
) => {
  const households = await readData(appId);
  const householdIndex = households.findIndex((h) => h.id === householdId);

  if (householdIndex === -1) {
    throw new Error("Domicílio não encontrado.");
  }

  const household = households[householdIndex];

  if (!household.memberNotes || household.memberNotes.length === 0) {
    throw new Error("Nenhuma anotação para excluir.");
  }

  const noteIndex = household.memberNotes.findIndex((n) => n.id === noteId);

  if (noteIndex === -1) {
    throw new Error("Anotação não encontrada.");
  }

  const noteToDelete = household.memberNotes[noteIndex];
  household.memberNotes.splice(noteIndex, 1);

  if (!household.history) {
    household.history = [];
  }
  household.history.push({
    date: new Date().toISOString(),
    changedBy: deletedBy,
    changeType: "Removido",
    change: `Anotação para "${noteToDelete.memberName}" foi removida.`,
  });

  household.lastUpdatedAt = new Date().toISOString();
  households[householdIndex] = household;
  await writeData(appId, households);

  return household;
};
