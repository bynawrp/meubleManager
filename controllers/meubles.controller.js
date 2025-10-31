import Meuble from '../models/Meuble.js';
import Categorie from '../models/Categorie.js';
import Materiau from '../models/Materiau.js';

export const getMeubles = async (req, res) => {
    try {
        const { search, categorie, tag } = req.query;
        let query = { createdBy: req.session.user.id };

        if (search) {
            query.nom = { $regex: search, $options: 'i' };
        }
        if (categorie) {
            query.categorie = categorie;
        }
        if (tag) {
            query.tags = { $in: [tag] };
        }
        
        const meubles = await Meuble.find(query).populate('categorie').populate('materiaux.materiau').sort({ createdAt: -1 });
        const categories = await Categorie.find();
        res.render('meubles/index', { title: 'Mes meubles', meubles, categories, filters: { search, categorie, tag } });
    } catch (error) {
        console.error('Erreur liste meubles:', error);
        res.status(500).redirect('/meubles');
    }
};

export const getNewMeuble = async (req, res) => {
    try {
        const categories = await Categorie.find();
        const materiaux = await Materiau.find().populate('fournisseur');
        res.render('meubles/new', { title: 'Nouveau meuble', categories, materiaux });
    } catch (error) {
        console.error('Erreur formulaire création:', error);
        res.status(500).redirect('/meubles');
    }
};

export const postMeuble = async (req, res) => {
    try {
        const { nom, categorie, description, tags, realisations } = req.body;
        const reals = parseInt(realisations) || 0;
        if (reals < 1) {
            const categories = await Categorie.find();
            const materiaux = await Materiau.find().populate('fournisseur');
            return res.render('meubles/new', { title: 'Nouveau meuble', categories, materiaux, error: 'Le nombre de réalisations doit être au moins égal à 1.' });
        }
        const tagsList = tags ? tags.split(',').map(t => t.trim()) : [];
        let mats = [];
        if (req.body.materiaux && req.body.materiaux.materiau) {
            let matIds = req.body.materiaux.materiau;
            let qtys = req.body.materiaux.quantite;
            if (!Array.isArray(matIds)) matIds = [matIds];
            if (!Array.isArray(qtys)) qtys = [qtys];
            mats = matIds.map((id, index) => ({ materiau: id, quantite: parseInt(qtys[index]) || 1 })).filter(item => item.materiau && item.materiau !== '');
        }
        if (mats.length === 0) {
            const categories = await Categorie.find();
            const materiaux = await Materiau.find().populate('fournisseur');
            return res.render('meubles/new', { title: 'Nouveau meuble', categories, materiaux, error: 'Au moins un matériau est requis.' });
        }
        const meuble = new Meuble({ nom, categorie, description, tags: tagsList, realisations: reals, materiaux: mats, createdBy: req.session.user.id });
        await meuble.save();
        res.redirect('/meubles');
    } catch (error) {
        console.error('Erreur création meuble:', error);
        const categories = await Categorie.find();
        const materiaux = await Materiau.find().populate('fournisseur');
        res.status(500).render('meubles/new', { title: 'Nouveau meuble', categories, materiaux, error: 'Une erreur est survenue lors de la création du meuble.' });
    }
};

export const getMeuble = async (req, res) => {
    try {
        const meuble = await Meuble.findOne({ _id: req.params.id, createdBy: req.session.user.id }).populate('categorie').populate('materiaux.materiau');
        if (!meuble) {
            return res.status(404).render('errors/404', { title: 'Meuble non trouvé' });
        }
        res.render('meubles/detail', { title: meuble.nom, meuble });
    } catch (error) {
        console.error('Erreur détail meuble:', error);
        res.status(500).redirect('/meubles');
    }
};

