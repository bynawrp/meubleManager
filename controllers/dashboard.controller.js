import Meuble from '../models/Meuble.js';

export const getDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const allMeubles = await Meuble.find({ createdBy: userId })
            .populate('categorie')
            .populate({
                path: 'materiaux.materiau',
                populate: { path: 'fournisseur' }
            });
        
        const topMeubles = allMeubles
            .sort((a, b) => (b.realisations || 0) - (a.realisations || 0))
            .slice(0, 6)
            .map(m => ({ 
                nom: m.nom, 
                categorie: m.categorie ? m.categorie.nom : 'N/A', 
                realisations: m.realisations || 0 
            }));
        
        const categoriesStats = {};
        allMeubles.forEach(meuble => {
            const catName = meuble.categorie ? meuble.categorie.nom : 'Sans catégorie';
            if (!categoriesStats[catName]) {
                categoriesStats[catName] = 0;
            }
            categoriesStats[catName] += 1;
        });
        
        const chartCategories = Object.keys(categoriesStats).map(cat => ({
            nom: cat,
            realisations: categoriesStats[cat]
        }));

        const materiauxStats = {};
        let totalQuantite = 0;
        
        allMeubles.forEach(meuble => {
            if (meuble.materiaux && meuble.materiaux.length > 0) {
                meuble.materiaux.forEach(item => {
                    if (item.materiau && item.materiau.nom) {
                        const materiauNom = item.materiau.nom;
                        if (!materiauxStats[materiauNom]) {
                            materiauxStats[materiauNom] = 0;
                        }
                        const qty = (item.quantite || 1) * (meuble.realisations || 1);
                        materiauxStats[materiauNom] += qty;
                        totalQuantite += qty;
                    }
                });
            }
        });
        
        const chartMateriaux = Object.keys(materiauxStats)
            .sort((a, b) => materiauxStats[b] - materiauxStats[a])
            .map(nom => ({
                nom: nom,
                quantite: materiauxStats[nom],
                pourcentage: totalQuantite > 0 ? Math.round((materiauxStats[nom] / totalQuantite) * 100) : 0
            }));

        const fournisseursStats = {};
        
        allMeubles.forEach(meuble => {
            if (meuble.materiaux && meuble.materiaux.length > 0) {
                meuble.materiaux.forEach(item => {
                    if (item.materiau && item.materiau.fournisseur) {
                        const fournName = item.materiau.fournisseur.nom || 'Sans fournisseur';
                        if (!fournisseursStats[fournName]) {
                            fournisseursStats[fournName] = 0;
                        }
                        fournisseursStats[fournName] += (item.quantite || 1) * (meuble.realisations || 1);
                    }
                });
            }
        });
        
        const chartFournisseurs = Object.keys(fournisseursStats)
            .sort((a, b) => fournisseursStats[b] - fournisseursStats[a])
            .map(fourn => ({
                nom: fourn,
                quantite: fournisseursStats[fourn]
            }));

        const stats = {
            totalMeubles: allMeubles.length,
            totalRealisations: allMeubles.reduce((sum, m) => sum + (m.realisations || 0), 0),
            topMeubles: topMeubles,
            chartCategories: JSON.stringify(chartCategories),
            chartMateriaux: JSON.stringify(chartMateriaux),
            chartFournisseurs: JSON.stringify(chartFournisseurs)
        };
        
        res.render('dashboard/index', { title: 'Dashboard', stats });
    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.status(500).redirect('/dashboard');
    }
};

