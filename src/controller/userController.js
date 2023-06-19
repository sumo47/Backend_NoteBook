const userModel = require('../models/UserModel')


const CreateUser = async (req, res) => {
    try {
        let data = req.body
        const savedData = await userModel.create(data)
        res.status(201).send(savedData)

    }
    catch (error) {
        res.send(error)

    }
}

module.exports.CreateUser = CreateUser