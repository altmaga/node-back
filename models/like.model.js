/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//

/*
Definition
*/
const MySchema = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'Like' },

    // Associer le profil utilisateur
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },

    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        default: null
    },

    // Définir une valeur par défaut
    creationDate: { type: Date, default: new Date() },
    dateModified: { type: Date, default: new Date() },
    isPublished: { type: Boolean, default: true }
})
//

/*
Export
*/
module.exports = mongoose.model('like', MySchema)
//
