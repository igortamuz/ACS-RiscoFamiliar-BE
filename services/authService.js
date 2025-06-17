const fs = require('fs');
const path = require('path');

let users = [];
try {
    users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mockUsers.json'), 'utf8'));
} catch (error) {
    console.error("Erro ao carregar mockUsers.json:", error);
}

const login = (cpf, password) => {
    const user = users.find(u => u.cpf === cpf && u.password === password);
    if (!user) {
        throw new Error('CPF ou senha incorretos.');
    }
    const { password: userPassword, ...userToReturn } = user;
    return userToReturn;
};

const requestPasswordReset = (identifier) => {
    const user = users.find(u => u.email === identifier || u.phone === identifier);
    // Em uma aplicação real, aqui seria enviado um e-mail/SMS.
    // Como é um mock, sempre retornamos sucesso para não expor informações.
    return 'Se as informações estiverem corretas, um link para redefinição de senha foi enviado.';
};

module.exports = {
    login,
    requestPasswordReset,
};