// Alterado de 'assert' para 'with' em ambas as importa��es
import households_itz from '../data/households_imperatriz.json' with { type: 'json' };
import households_ctb from '../data/households_curitiba.json' with { type: 'json' };

const householdsData = {
    itz: households_itz,
    ctb: households_ctb,
};

/**
 * Retorna todos os domic�lios de uma cidade.
 */
const getHouseholds = (query) => {
    const city = query.city || query.appId;
    const cityData = householdsData[city];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }
    return cityData;
};

/**
 * Retorna um domic�lio espec�fico pelo seu ID.
 */
const getHouseholdById = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }
    // IDs agora s�o strings, como "domicilio-itz-1"
    const household = cityData.find(h => h.id === id);
    if (!household) {
        throw new Error('Domic�lio n�o encontrado');
    }
    return household;
};

/**
 * Adiciona um novo domic�lio ao "banco de dados".
 */
const addHousehold = (householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }

    // L�gica para gerar um novo ID no formato "domicilio-itz-N"
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
 * Atualiza os dados de um domic�lio existente.
 */
const updateHousehold = (id, householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }

    const householdIndex = cityData.findIndex(h => h.id === id);

    if (householdIndex === -1) {
        throw new Error('Domic�lio n�o encontrado para atualizar.');
    }

    // Combina os dados antigos com os novos, mantendo o ID original
    const updatedHousehold = { ...cityData[householdIndex], ...householdData, id: id };

    cityData[householdIndex] = updatedHousehold;
    return updatedHousehold;
};

/**
 * Deleta um domic�lio do "banco de dados".
 */
const deleteHousehold = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }

    const initialLength = cityData.length;
    householdsData[appId] = cityData.filter(h => h.id !== id);

    return householdsData[appId].length < initialLength;
};

/**
 * Adiciona uma anota��o a um domic�lio.
 * A fun��o agora recebe o ID do DOMIC�LIO.
 */
const addMemberNote = (householdId, noteData, appId) => {
    const household = getHouseholdById(householdId, appId); // Reutiliza a fun��o de busca

    // Gera um ID para a nova anota��o no formato "note-itz-1-1"
    const householdNumericId = household.id.split('-').pop();
    const maxNoteNumericId = household.memberNotes.map(n => parseInt(n.id.split('-').pop())).reduce((max, id) => Math.max(max, id), 0);
    const newNoteId = `note-${appId}-${householdNumericId}-${maxNoteNumericId + 1}`;

    const newNote = {
        id: newNoteId,
        memberName: noteData.memberName, // O nome do membro deve vir no corpo da requisi��o
        note: noteData.note,
        files: [],
        createdAt: new Date().toISOString(),
        createdBy: noteData.createdBy // O autor tamb�m deve vir na requisi��o
    };

    household.memberNotes.push(newNote);
    return newNote;
};

/**
 * Deleta uma anota��o de um domic�lio.
 * Recebe o ID do domic�lio e o ID da anota��o.
 */
const deleteMemberNote = (householdId, noteId, appId) => {
    const household = getHouseholdById(householdId, appId);

    const initialLength = household.memberNotes.length;
    household.memberNotes = household.memberNotes.filter(n => n.id !== noteId);

    if (household.memberNotes.length >= initialLength) {
        throw new Error('Anota��o n�o encontrada.');
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