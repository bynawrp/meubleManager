import Materiau from '../models/Materiau.js';
import Fournisseur from '../models/Fournisseur.js';
import Meuble from '../models/Meuble.js';

export const getMateriaux = async (req, res) => {
    try {
        const { type, fournisseur } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }

        if (fournisseur) {
            query.fournisseur = fournisseur;
        }
        const materiaux = await Materiau.find(query).populate('fournisseur').sort({ type: 1, nom: 1 });
        const fournisseurs = await Fournisseur.find();
        res.render('materiaux/index', { title: 'Gestion des matériaux', materiaux, fournisseurs, filters: { type, fournisseur } });
    } catch (error) {
        console.error('Erreur liste matériaux:', error);
        res.status(500).redirect('/materiaux');
    }
};

export const getNewMateriau = async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.find();
        res.render('materiaux/new', { title: 'Nouveau matériau', fournisseurs });
    } catch (error) {
        console.error('Erreur formulaire création matériau:', error);
        res.status(500).redirect('/materiaux');
    }
};

export const postMateriau = async (req, res) => {
    try {
        const { nom, type, fournisseur, description } = req.body;
        const materiau = new Materiau({ nom, type, fournisseur, description });
        await materiau.save();
        res.redirect('/materiaux/' + materiau._id);
    } catch (error) {
        console.error('Erreur création matériau:', error);
        const fournisseurs = await Fournisseur.find();
        res.status(500).render('materiaux/new', { title: 'Nouveau matériau', fournisseurs, error: 'Une erreur est survenue lors de la création du matériau.' });
    }
};

export const getByTag = async (req, res) => {
    try {
        const tag = decodeURIComponent(req.params.tag);
        const userId = req.session.user.id;
        const meubles = await Meuble.find({ createdBy: userId, tags: { $in: [tag] } }).populate('categorie').populate('materiaux.materiau').sort({ createdAt: -1 });
        res.render('materiaux/by-tag', { title: `Meubles - Tag: ${tag}`, tag, meubles });
    } catch (error) {
        console.error('Erreur meubles par tag:', error);
        res.status(500).redirect('/materiaux');
    }
};

export const getEditMateriau = async (req, res) => {
    try {
        const materiau = await Materiau.findById(req.params.id).populate('fournisseur');

        if (!materiau) {
            return res.status(404).render('errors/404', { title: 'Matériau non trouvé' });
        }

        const fournisseurs = await Fournisseur.find();
        res.render('materiaux/edit', { title: `Modifier ${materiau.nom}`, materiau, fournisseurs });
    } catch (error) {
        console.error('Erreur formulaire édition matériau:', error);
        res.status(500).redirect('/materiaux');
    }
};

export const putMateriau = async (req, res) => {
    try {
        const { nom, type, fournisseur, description } = req.body;
        const materiau = await Materiau.findById(req.params.id);

        if (!materiau) {
            return res.status(404).render('errors/404', { title: 'Matériau non trouvé' });
        }

        materiau.nom = nom;
        materiau.type = type;
        materiau.fournisseur = fournisseur;
        materiau.description = description;
        materiau.updatedAt = Date.now();
        
        await materiau.save();
        res.redirect('/materiaux/' + materiau._id);
    } catch (error) {
        console.error('Erreur mise à jour matériau:', error);
        const materiau = await Materiau.findById(req.params.id).populate('fournisseur');
        const fournisseurs = await Fournisseur.find();
        res.status(500).render('materiaux/edit', { title: 'Modifier matériau', materiau, fournisseurs, error: 'Une erreur est survenue lors de la mise à jour du matériau.' });
    }
};

export const getMateriau = async (req, res) => {
    try {
        const materiau = await Materiau.findById(req.params.id).populate('fournisseur');
        
        if (!materiau) {
            return res.status(404).render('errors/404', { title: 'Matériau non trouvé' });
        }
        
        res.render('materiaux/detail', { title: materiau.nom, materiau });
    } catch (error) {
        console.error('Erreur détail matériau:', error);
        res.status(500).redirect('/materiaux');
    }
};

