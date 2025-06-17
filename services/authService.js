import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Constrói o caminho absoluto para o arquivo JSON de forma segura
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, '..', 'data', 'mockUsers.json');


const getUsers = () => {
    try {
        const usersData = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error("Falha ao ler ou parsear o arquivo de usuários:", error);
        throw new Error("Erro interno ao acessar os dados de usuário.");
    }
};

const login = (cpf, password) => {
    const users = getUsers();
    const user = users.find(u => u.cpf === cpf && u.password === password);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const requestPasswordReset = (identifier) => {
    const users = getUsers(); 
    const user = users.find(u => u.cpf === identifier || u.email === identifier);

    if (!user) {
        throw new Error('User not found');
    }

    return {
        message: `Password reset link sent to the registered email for user ${user.name}.`,
        user: { name: user.name, email: user.email }
    };
};

export default {
    login,
    requestPasswordReset,
};