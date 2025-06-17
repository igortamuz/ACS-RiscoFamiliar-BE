import users from '../data/mockUsers.json' with { type: 'json' };

const login = (cpf, password) => {
    const user = users.find(u => u.cpf === cpf && u.password === password);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    return { id: user.id, name: user.name, role: user.role };
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