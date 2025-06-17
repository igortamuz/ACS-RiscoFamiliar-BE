import authService from '../services/authService.js';

const login = (req, res) => {
    try {
        const { cpf, password } = req.body;

        if (!cpf || !password) {
            return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
        }

        const user = authService.login(cpf, password);

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: 'mock-jwt-token',
            user: user
        });

    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ message: 'CPF ou senha inválidos.' });
        } else {
            console.error("Erro inesperado no controller de login:", error);
            res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
};

export default {
    login
};