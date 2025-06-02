const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('page', pageSchema) 