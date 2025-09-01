const express = require('express');
const crypto = require('crypto');

module.exports = (User) => {
    const router = express.Router();

    function isPasswordStrong(password) {
        // règle simple: min 8, au moins une lettre et un chiffre
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    }

    router.post('/register', async (req, res) => {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
            }
            if (!isPasswordStrong(password)) {
                return res.status(400).json({ success: false, message: 'Mot de passe trop faible (8+ caractères, 1 lettre, 1 chiffre)' });
            }
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            const user = await User.create({ email, passwordHash });
            return res.status(201).json({ success: true, data: { id: user.id, email: user.email } });
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
            }
            console.error(e);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
            }
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            const user = await User.findOne({ where: { email } });
            if (!user || user.passwordHash !== passwordHash) {
                return res.status(401).json({ success: false, message: 'Identifiants invalides' });
            }
            // token de session très simple stocké en base
            const token = crypto.randomBytes(24).toString('hex');
            user.session_token = token;
            await user.save();
            res.json({ success: true, token, user: { id: user.id, email: user.email } });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    });

    router.post('/logout', async (req, res) => {
        try {
            const token = req.headers['authorization']?.replace('Bearer ', '') || '';
            if (!token) return res.status(400).json({ success: false, message: 'Token manquant' });
            const user = await User.findOne({ where: { session_token: token } });
            if (user) {
                user.session_token = null;
                await user.save();
            }
            res.json({ success: true });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    });

    return router;
};


