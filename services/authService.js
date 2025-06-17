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
    // Em uma aplica��o real, aqui seria enviado um e-mail/SMS.
    // Como � um mock, sempre retornamos sucesso para n�o expor informa��es.
    return 'Se as informa��es estiverem corretas, um link para redefini��o de senha foi enviado.';
};

module.exports = {
    login,
    requestPasswordReset,
};