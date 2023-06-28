const noteModel = require('../models/NotesModel')
const userModel = require('../models/UserModel')

const createNote = async (req,res)=>{
    try {
        let data = req.body
        let userId = req.decode.userId
        data.user = userId

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body is require !" })
        if (!data.title) return res.status(400).send({ status: false, message: "title require" })
        if (!data.description) return res.status(400).send({ status: false, message: "description require" })
        if (!data.tag) return res.status(400).send({ status: false, message: "tag require" })

        let user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(401).send({ status: false, message: "You are not authorised, user not exist" })

        const saveData = await noteModel.create(data)
        
        res.status(201).send({status:true , message:saveData})
        
    } catch (error) {
        res.status(500).send({ stauts: false, message: error.message })
    }
}

module.exports.createNote = createNote