import User from '../models/User.js';

export const getLogin = (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('auth/login', { title: 'Connexion' });
};

export const postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });

        if (!user) {
            return res.render('auth/login', { title: 'Connexion', error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.render('auth/login', { title: 'Connexion', error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        req.session.user = { id: user._id, username: user.username };
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.render('auth/login', { title: 'Connexion', error: 'Une erreur est survenue lors de la connexion' });
    }
};

export const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur de déconnexion:', err);
        }
        res.redirect('/auth/login');
    });
};  
