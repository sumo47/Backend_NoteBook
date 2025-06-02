const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'page'
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('note', noteSchema) //converting schema to model