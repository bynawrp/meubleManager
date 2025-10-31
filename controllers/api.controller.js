import Meuble from '../models/Meuble.js';

export const getStats = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const meublesCat = await Meuble.find({ createdBy: userId }).populate('categorie').select('categorie');
        const catCounts = {};

        meublesCat.forEach(meuble => {
            if (meuble.categorie && meuble.categorie.nom) catCounts[meuble.categorie.nom] = (catCounts[meuble.categorie.nom] || 0) + 1;
        });

        const catStats = Object.entries(catCounts).map(([nom, count]) => ({ _id: nom, count }));
        const meubles = await Meuble.find({ createdBy: userId }).populate({ path: 'materiaux.materiau', select: 'nom' }).select('materiaux');
        const matCounts = {};

        meubles.forEach(meuble => {
            if (meuble.materiaux && meuble.materiaux.length > 0) {
                meuble.materiaux.forEach(item => {
                    if (item.materiau && item.materiau.nom) {
                        const qty = item.quantite || 1;
                        matCounts[item.materiau.nom] = (matCounts[item.materiau.nom] || 0) + qty;
                    }
                });
            }
        });

        const matStats = Object.entries(matCounts).map(([nom, count]) => ({ _id: nom, count })).sort((a, b) => b.count - a.count);
        const meublesFourn = await Meuble.find({ createdBy: userId }).populate({ path: 'materiaux.materiau', populate: { path: 'fournisseur', select: 'nom' } }).select('materiaux');
        const fournCounts = {};

        meublesFourn.forEach(meuble => {
            if (meuble.materiaux && meuble.materiaux.length > 0) {
                meuble.materiaux.forEach(item => {
                    if (item.materiau && item.materiau.fournisseur && item.materiau.fournisseur.nom) {
                        const qty = item.quantite || 1;
                        fournCounts[item.materiau.fournisseur.nom] = (fournCounts[item.materiau.fournisseur.nom] || 0) + qty;
                    }
                });
            }
        });
        
        const fournStats = Object.entries(fournCounts).map(([nom, count]) => ({ _id: nom, count })).sort((a, b) => b.count - a.count);
        res.json({
            byCategorie: catStats.length > 0 ? catStats : [{ _id: 'Aucune', count: 0 }],
            byMateriau: matStats.length > 0 ? matStats : [{ _id: 'Aucun matériau', count: 0 }],
            byFournisseur: fournStats.length > 0 ? fournStats : [{ _id: 'Aucun fournisseur', count: 0 }]
        });
    } catch (error) {
        console.error('Erreur API stats:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

