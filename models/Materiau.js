import mongoose from 'mongoose';

const materiauSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Bois', 'Fer', 'Plastique'],
        index: true
    },
    fournisseur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
   
});

materiauSchema.index({ nom: 1, type: 1 });

export default mongoose.model('Materiau', materiauSchema);

