const fs = require('fs');
const path = require('path');

// Carrega os dados dos arquivos JSON
const loadData = () => {
    try {
        const imperatrizData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/households_imperatriz.json'), 'utf8'));
        const curitibaData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/households_curitiba.json'), 'utf8'));
        return {
            'imperatriz-ma': imperatrizData,
            'curitiba-pr': curitibaData
        };
    } catch (error) {
        console.error("Erro ao carregar dados dos domicílios:", error);
        return { 'imperatriz-ma': [], 'curitiba-pr': [] };
    }
};

let datasets = loadData();

const getDb = (appId) => datasets[appId] || [];

const getHouseholds = (options = {}) => {
    const { page = 1, limit = 10, filters = "{}", riskFilters = "[]", sortConfig = "{}", appId } = options;
    const parsedFilters = JSON.parse(filters);
    const parsedRiskFilters = JSON.parse(riskFilters);
    const parsedSortConfig = JSON.parse(sortConfig);

    let results = [...getDb(appId)];

    // Lógica de filtro e ordenação (simplificada para o exemplo)
    if (Object.keys(parsedFilters).length > 0 && parsedFilters.responsibleName) {
        results = results.filter(h => h.responsibleName.toLowerCase().includes(parsedFilters.responsibleName.toLowerCase()));
    }

    if (parsedSortConfig.key) {
        // Implementar lógica de ordenação aqui se necessário
    }

    const totalItems = results.length;
    const paginatedData = results.slice((page - 1) * limit, page * limit);

    return { data: paginatedData, totalItems };
};

const getHouseholdById = (id, appId) => {
    const db = getDb(appId);
    const household = db.find(h => h.id === id);
    if (!household) {
        throw new Error('Domicílio não encontrado.');
    }
    return household;
};

const addHousehold = (data, appId) => {
    const db = getDb(appId);
    const newHousehold = {
        ...data,
        id: `${appId}-local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
    };
    db.push(newHousehold);
    return newHousehold;
};

const updateHousehold = (id, data, appId) => {
    const db = getDb(appId);
    const index = db.findIndex(h => h.id === id);
    if (index === -1) {
        throw new Error('Domicílio não encontrado para atualização.');
    }
    db[index] = { ...db[index], ...data, lastUpdatedAt: new Date().toISOString() };
    return db[index];
};

const deleteHousehold = (id, appId) => {
    if (datasets[appId]) {
        const initialLength = datasets[appId].length;
        datasets[appId] = datasets[appId].filter(h => h.id !== id);
        return initialLength > datasets[appId].length;
    }
    return false;
};

const addMemberNote = (householdId, noteData, appId) => {
    const db = getDb(appId);
    const household = db.find(h => h.id === householdId);
    if (!household) {
        throw new Error('Domicílio não encontrado.');
    }
    const newNote = { ...noteData, id: `note-${Date.now()}`, createdAt: new Date().toISOString() };
    if (!household.memberNotes) {
        household.memberNotes = [];
    }
    household.memberNotes.unshift(newNote);
    return newNote;
};

const deleteMemberNote = (householdId, noteId, appId) => {
    const db = getDb(appId);
    const household = db.find(h => h.id === householdId);
    if (household && household.memberNotes) {
        const initialLength = household.memberNotes.length;
        household.memberNotes = household.memberNotes.filter(note => note.id !== noteId);
        return initialLength > household.memberNotes.length;
    }
    return false;
};


module.exports = {
    getHouseholds,
    getHouseholdById,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    addMemberNote,
    deleteMemberNote
};