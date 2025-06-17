import authService from '../services/authService.js';

const login = (req, res) => {
    try {
        const { username, password } = req.body;
        const user = authService.authenticate(username, password);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
			res.status(200).json({ message: 'Endpoint de login alcançado com sucesso!' });

        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    login
};
