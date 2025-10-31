import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Fournisseur from '../models/Fournisseur.js';
import Categorie from '../models/Categorie.js';
import Materiau from '../models/Materiau.js';
import Meuble from '../models/Meuble.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connexion à MongoDB réussie');
}).catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    console.error('Vérifiez que MONGO_URL est défini dans votre fichier .env');
    process.exit(1);
});

function loadJSON(filename) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', filename), 'utf8'));
}

async function seed() {
    try {
        console.log('Début du seed...');
        console.log('Suppression des données existantes...');
        await User.deleteMany({});
        await Fournisseur.deleteMany({});
        await Categorie.deleteMany({});
        await Materiau.deleteMany({});
        await Meuble.deleteMany({});
        
        console.log('Chargement des utilisateurs...');
        const usersData = loadJSON('users.json');
        const adminUser = new User({ username: usersData[0].username, password: usersData[0].password });
        await adminUser.save();
        const fournisseurs = await Fournisseur.insertMany(loadJSON('fournisseurs.json'));
        const fournisseursMap = {};
        fournisseurs.forEach(f => { fournisseursMap[f.nom] = f._id });
        const categories = await Categorie.insertMany(loadJSON('categories.json'));
        const categoriesMap = {};
        categories.forEach(c => { categoriesMap[c.nom] = c._id });
        const materiauxData = loadJSON('materiaux.json');
        const materiaux = await Materiau.insertMany(materiauxData.map(m => ({ nom: m.nom, type: m.type, fournisseur: fournisseursMap[m.fournisseur] })));
        const materiauxMap = {};
        materiaux.forEach(m => { materiauxMap[m.nom] = m._id });
        const meublesData = loadJSON('meubles.json');
        await Meuble.insertMany(meublesData.map(m => ({ nom: m.nom, categorie: categoriesMap[m.categorie], description: m.description || '', materiaux: m.materiaux.map(mat => ({ materiau: materiauxMap[mat.materiau], quantite: mat.quantite || 1 })), tags: m.tags || [], realisations: m.realisations || 0, createdBy: adminUser._id })));
        console.log('Seed terminé avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du seed:', error);
        process.exit(1);
    }
}

seed();
