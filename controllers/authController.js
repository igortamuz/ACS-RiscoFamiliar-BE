import authService from '../services/authService.js';

const loginUser = (req, res) => {
    try {
        const { cpf, password } = req.body;
        const user = authService.login(cpf, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const resetPassword = (req, res) => {
    try {
        const { identifier } = req.body;
        const message = authService.requestPasswordReset(identifier);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    loginUser,
    resetPassword,
};