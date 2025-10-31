import mongoose from 'mongoose';

const categorieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['Armoire', 'Etagère']
    },
    description: {
        type: String,
        trim: true
    },
   
});

export default mongoose.model('Categorie', categorieSchema);

