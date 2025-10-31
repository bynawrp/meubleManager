import mongoose from 'mongoose';

const fournisseurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    contact: {
        telephone: String,
        email: String,
        adresse: String
    },
   
});

export default mongoose.model('Fournisseur', fournisseurSchema);

