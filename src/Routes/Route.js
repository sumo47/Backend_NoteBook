const express = require('express')
const router = express.Router()
const { CreateUser, LoginUser, getUser } = require('../controller/UserController')
const { 
    createNote, 
    getNote, 
    getArchivedNotes, 
    updateNote, 
    deleteNote, 
    archiveNote, 
    restoreNote,
    searchNotes
} = require('../controller/NoteController')
const { createPage, getPages, updatePage, deletePage } = require('../controller/PageController')
const { auth } = require('../middleware/Authentication')


router.get("/test", (req, res) => { //! work on it
    setTimeout(() => {
        res.status(200).send("My First ever Api")
    }, 1000);
})

router.get("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        console.log("bjk")
        res.status(200).send({ status: true, message: "Backend Notebo" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
})

router.post("/createUser", CreateUser)
router.post("/login", LoginUser)
router.get('/getUser', auth, getUser)

router.post('/createNote', auth, createNote)
router.get('/getNotes', auth, getNote)
router.get('/getArchivedNotes', auth, getArchivedNotes)
router.put('/updateNote/:noteId', auth, updateNote)
router.delete('/deleteNote/:noteId', auth, deleteNote)
router.put('/archiveNote/:noteId', auth, archiveNote)
router.put('/restoreNote/:noteId', auth, restoreNote)
router.get('/searchNotes', auth, searchNotes)

router.post('/createPage', auth, createPage)
router.get('/getPages', auth, getPages)
router.put('/updatePage/:pageId', auth, updatePage)
router.delete('/deletePage/:pageId', auth, deletePage)

module.exports = router 