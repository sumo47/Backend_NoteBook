const noteModel = require('../models/NotesModel')
const userModel = require('../models/UserModel')
const pageModel = require('../models/PageModel')
const { mongoose } = require('mongoose')

const createNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        let data = req.body
        let userId = req.decode.userId //taking id from auth api
        data.user = userId

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body is require !" })
        if (!data.title) return res.status(400).send({ status: false, message: "title require" })
        if (!data.description) return res.status(400).send({ status: false, message: "description require" })
        if (!data.tag) return res.status(400).send({ status: false, message: "tag require" })
        if (!data.pageId) return res.status(400).send({ status: false, message: "pageId require" })

        let user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(401).send({ status: false, message: "You are not authorised, user not exist" })

        // Verify that the page exists and belongs to the user
        const page = await pageModel.findOne({ _id: data.pageId, user: userId })
        if (!page) return res.status(404).send({ status: false, message: "Page not found or you don't have access to it" })

        const saveData = await noteModel.create(data)

        res.status(201).send({ status: true, message: saveData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        // console.log("getnotecd ")
        const userId = req.decode.userId
        const { startDate, endDate, pageId } = req.query

        const query = { 
            user: userId,
            isArchived: false // Only get non-archived notes
        }
        
        // Add page filter if provided
        if (pageId) {
            query.pageId = pageId
        }
        
        // Add date filters if provided
        query.createdAt = {
            $gte: startDate ? new Date(startDate) : new Date(0),
            $lte: endDate ? new Date(endDate) : new Date()
        }
        
        let saveData = await noteModel.find(query)
        console.log("date" + startDate, endDate)
        
        if (saveData.length < 1) return res.status(404).send({ status: false, message: "No Notes found" })

        res.status(200).send({ status: true, message: saveData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getArchivedNotes = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const userId = req.decode.userId

        const query = { 
            user: userId,
            isArchived: true // Only get archived notes
        }
        
        let archivedNotes = await noteModel.find(query)
        
        res.status(200).send({ status: true, message: archivedNotes })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const updateNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        let { title, description, tag, pageId } = req.body
        const noteId = req.params.noteId
        const userId = req.decode.userId

        if (!title) return res.status(404).send({ status: false, message: "Title Required" })
        if (!description) return res.status(404).send({ status: false, message: "description Required" })
        if (!tag) { tag = "General" }

        // console.log(noteId)
        // console.log(userId)
        if (!mongoose.isValidObjectId(noteId)) return res.status(400).send({ status: false, message: "No note specified/Wrong noteID" })
        if (!req.body) return res.status(400).send({ status: false, message: "No data found" })

        const findNote = await noteModel.findById(noteId)
        if (!findNote) return res.status(400).send({ status: false, message: "No notes found or deleted" })// note exist or not

        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(400).send({ status: false, message: "Login with correct credential" }) // user exist ot not

        if (findNote.user.toString() != userId) return res.status(401).send({ status: false, message: "Unauthorized" }) //authorized or not //!why we wrote toString() function

        // If pageId is provided, verify that it exists and belongs to the user
        if (pageId) {
            const page = await pageModel.findOne({ _id: pageId, user: userId })
            if (!page) return res.status(404).send({ status: false, message: "Page not found or you don't have access to it" })
        } else {
            pageId = findNote.pageId // Keep the existing pageId if not provided
        }

        const saveData = await noteModel.findByIdAndUpdate(
            noteId, 
            { $set: { title, description, tag, pageId } }, 
            { new: true }
        )
        
        res.status(200).send({ status: true, message: saveData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

const deleteNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const noteId = req.params.noteId
        const userId = req.decode.userId

        if (!mongoose.isValidObjectId(noteId)) return res.status(400).send({ status: false, message: "No note specified/Wrong noteID" })

        const findNote = await noteModel.findById(noteId)
        if (!findNote) return res.status(400).send({ status: false, message: "No notes found or deleted" })// note exist or not

        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(400).send({ status: false, message: "Login with correct credential" })

        if (findNote.user.toString() != userId) return res.status(401).send({ status: false, message: "Unauthorized" }) //authorized or not

        await noteModel.findByIdAndDelete(noteId)
        res.status(200).send({ status: true, message: "Note deleted successfully" })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}

const archiveNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const noteId = req.params.noteId
        const userId = req.decode.userId

        if (!mongoose.isValidObjectId(noteId)) return res.status(400).send({ status: false, message: "No note specified/Wrong noteID" })

        const findNote = await noteModel.findById(noteId)
        if (!findNote) return res.status(400).send({ status: false, message: "No notes found or deleted" })

        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(400).send({ status: false, message: "Login with correct credential" })

        if (findNote.user.toString() != userId) return res.status(401).send({ status: false, message: "Unauthorized" })

        if (findNote.isArchived) return res.status(400).send({ status: false, message: "Note is already archived" })

        const saveData = await noteModel.findByIdAndUpdate(
            noteId, 
            { $set: { isArchived: true } }, 
            { new: true }
        )
        
        res.status(200).send({ status: true, message: saveData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const restoreNote = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const noteId = req.params.noteId
        const userId = req.decode.userId

        if (!mongoose.isValidObjectId(noteId)) return res.status(400).send({ status: false, message: "No note specified/Wrong noteID" })

        const findNote = await noteModel.findById(noteId)
        if (!findNote) return res.status(400).send({ status: false, message: "No notes found or deleted" })

        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(400).send({ status: false, message: "Login with correct credential" })

        if (findNote.user.toString() != userId) return res.status(401).send({ status: false, message: "Unauthorized" })

        if (!findNote.isArchived) return res.status(400).send({ status: false, message: "Note is not archived" })

        const saveData = await noteModel.findByIdAndUpdate(
            noteId, 
            { $set: { isArchived: false } }, 
            { new: true }
        )
        
        res.status(200).send({ status: true, message: saveData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const searchNotes = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const userId = req.decode.userId
        const { query } = req.query

        if (!query) return res.status(400).send({ status: false, message: "Search query is required" })

        // Search in non-archived notes only
        const searchResults = await noteModel.find({
            user: userId,
            isArchived: false,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tag: { $regex: query, $options: 'i' } }
            ]
        })
        
        res.status(200).send({ status: true, message: searchResults })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    createNote,
    getNote,
    getArchivedNotes,
    updateNote,
    deleteNote,
    archiveNote,
    restoreNote,
    searchNotes
}