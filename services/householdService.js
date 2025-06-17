// Alterado de 'assert' para 'with' em ambas as importações
import households_itz from '../data/households_imperatriz.json' with { type: 'json' };
import households_ctb from '../data/households_curitiba.json' with { type: 'json' };

const householdsData = {
    itz: households_itz,
    ctb: households_ctb,
};

/**
 * Retorna todos os domicílios de uma cidade.
 */
const getHouseholds = (query) => {
    const city = query.city || query.appId;
    const cityData = householdsData[city];
    if (!cityData) {
        throw new Error('Cidade não encontrada');
    }
    return cityData;
};

/**
 * Retorna um domicílio específico pelo seu ID.
 */
const getHouseholdById = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade não encontrada');
    }
    // IDs agora são strings, como "domicilio-itz-1"
    const household = cityData.find(h => h.id === id);
    if (!household) {
        throw new Error('Domicílio não encontrado');
    }
    return household;
};

/**
 * Adiciona um novo domicílio ao "banco de dados".
 */
const addHousehold = (householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade não encontrada');
    }

    // Lógica para gerar um novo ID no formato "domicilio-itz-N"
    const numericIds = cityData.map(h => parseInt(h.id.split('-').pop()));
    const maxId = Math.max(0, ...numericIds);
    const newId = `domicilio-${appId}-${maxId + 1}`;

    const newHousehold = {
        id: newId,
        ...householdData,
        // Garante que arrays importantes existam
        members: householdData.members || [],
        memberNotes: householdData.memberNotes || [],
        visits: householdData.visits || [],
        history: householdData.history || []
    };

    cityData.push(newHousehold);
    return newHousehold;
};

/**
 * Atualiza os dados de um domicílio existente.
 */
const updateHousehold = (id, householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade não encontrada');
    }

    const householdIndex = cityData.findIndex(h => h.id === id);

    if (householdIndex === -1) {
        throw new Error('Domicílio não encontrado para atualizar.');
    }

    // Combina os dados antigos com os novos, mantendo o ID original
    const updatedHousehold = { ...cityData[householdIndex], ...householdData, id: id };

    cityData[householdIndex] = updatedHousehold;
    return updatedHousehold;
};

/**
 * Deleta um domicílio do "banco de dados".
 */
const deleteHousehold = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade não encontrada');
    }

    const initialLength = cityData.length;
    householdsData[appId] = cityData.filter(h => h.id !== id);

    return householdsData[appId].length < initialLength;
};

/**
 * Adiciona uma anotação a um domicílio.
 * A função agora recebe o ID do DOMICÍLIO.
 */
const addMemberNote = (householdId, noteData, appId) => {
    const household = getHouseholdById(householdId, appId); // Reutiliza a função de busca

    // Gera um ID para a nova anotação no formato "note-itz-1-1"
    const householdNumericId = household.id.split('-').pop();
    const maxNoteNumericId = household.memberNotes.map(n => parseInt(n.id.split('-').pop())).reduce((max, id) => Math.max(max, id), 0);
    const newNoteId = `note-${appId}-${householdNumericId}-${maxNoteNumericId + 1}`;

    const newNote = {
        id: newNoteId,
        memberName: noteData.memberName, // O nome do membro deve vir no corpo da requisição
        note: noteData.note,
        files: [],
        createdAt: new Date().toISOString(),
        createdBy: noteData.createdBy // O autor também deve vir na requisição
    };

    household.memberNotes.push(newNote);
    return newNote;
};

/**
 * Deleta uma anotação de um domicílio.
 * Recebe o ID do domicílio e o ID da anotação.
 */
const deleteMemberNote = (householdId, noteId, appId) => {
    const household = getHouseholdById(householdId, appId);

    const initialLength = household.memberNotes.length;
    household.memberNotes = household.memberNotes.filter(n => n.id !== noteId);

    if (household.memberNotes.length >= initialLength) {
        throw new Error('Anotação não encontrada.');
    }

    return true; // Sucesso
};


export default {
    getHouseholds,
    getHouseholdById,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    addMemberNote,
    deleteMemberNote
};