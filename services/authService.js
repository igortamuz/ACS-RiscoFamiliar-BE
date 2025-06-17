import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Constrói o caminho absoluto para o arquivo JSON de forma segura
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, '..', 'data', 'mockUsers.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

const login = (cpf, password) => {
    const user = users.find(u => u.cpf === cpf && u.password === password);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    // Boa prática: não retorne a senha na resposta da API
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const requestPasswordReset = (identifier) => {
    const user = users.find(u => u.cpf === identifier || u.email === identifier);
    if (!user) {
        throw new Error('User not found');
    }
    return `Password reset link sent to the registered email for user ${user.name}.`;
};

export default {
    login,
    requestPasswordReset,
};