import mongoose from 'mongoose';

const meubleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    materiaux: [{
        materiau: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Materiau'
        },
        quantite: {
            type: Number,
            default: 1
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    realisations: {
        type: Number,
        default: 0,
        min: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

meubleSchema.index({ nom: 1, categorie: 1 });
meubleSchema.index({ tags: 1 });

export default mongoose.model('Meuble', meubleSchema);

