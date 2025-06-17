import households_itz from '../data/households_imperatriz.json' with { type: 'json' };
import households_ctb from '../data/households_curitiba.json' with { type: 'json' };

// Centraliza os dados dos domic�lios por cidade
const householdsData = {
    'imperatriz-ma': households_itz,
    'curitiba-pr': households_ctb,
};

// Retorna todos os domic�lios de uma cidade espec�fica.
const getHouseholds = (query) => {
    const city = query.city || query.appId;
    const cityData = householdsData[city];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }
    return cityData;
};

// Busca e retorna um domic�lio espec�fico pelo seu ID.
const getHouseholdById = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }
    const household = cityData.find(h => h.id === id);
    if (!household) {
        throw new Error('Domic�lio n�o encontrado');
    }
    return household;
};

// Adiciona um novo domic�lio � lista da cidade.
const addHousehold = (householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }

    const numericIds = cityData.map(h => parseInt(h.id.split('-').pop() || '0'));
    const maxId = Math.max(0, ...numericIds);
    const newId = `domicilio-${appId}-${maxId + 1}`;

    const newHousehold = {
        id: newId,
        ...householdData,
        members: householdData.members || [],
        memberNotes: householdData.memberNotes || [],
        visits: householdData.visits || [],
        history: householdData.history || []
    };

    cityData.push(newHousehold);
    return newHousehold;
};

// Atualiza os dados de um domic�lio existente.
const updateHousehold = (id, householdData, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }

    const householdIndex = cityData.findIndex(h => h.id === id);
    if (householdIndex === -1) {
        throw new Error('Domic�lio n�o encontrado para atualizar.');
    }

    const updatedHousehold = { ...cityData[householdIndex], ...householdData, id: id };
    cityData[householdIndex] = updatedHousehold;
    return updatedHousehold;
};

// Remove um domic�lio da lista pelo seu ID.
const deleteHousehold = (id, appId) => {
    const cityData = householdsData[appId];
    if (!cityData) {
        throw new Error('Cidade n�o encontrada');
    }
    const initialLength = cityData.length;
    householdsData[appId] = cityData.filter(h => h.id !== id);
    return householdsData[appId].length < initialLength;
};

// Adiciona uma nova anota��o a um domic�lio.
const addMemberNote = (householdId, noteData, appId) => {
    const household = getHouseholdById(householdId, appId);

    const householdNumericId = household.id.split('-').pop();
    const maxNoteNumericId = household.memberNotes
        .map(n => parseInt(n.id.split('-').pop() || '0'))
        .reduce((max, id) => Math.max(max, id), 0);
    const newNoteId = `note-${appId}-${householdNumericId}-${maxNoteNumericId + 1}`;

    const newNote = {
        id: newNoteId,
        memberName: noteData.memberName,
        note: noteData.note,
        files: [],
        createdAt: new Date().toISOString(),
        createdBy: noteData.createdBy
    };

    household.memberNotes.push(newNote);
    return newNote;
};

// Remove uma anota��o de um domic�lio.
const deleteMemberNote = (householdId, noteId, appId) => {
    const household = getHouseholdById(householdId, appId);
    const initialLength = household.memberNotes.length;

    household.memberNotes = household.memberNotes.filter(n => n.id !== noteId);

    if (household.memberNotes.length === initialLength) {
        throw new Error('Anota��o n�o encontrada.');
    }
    return true;
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