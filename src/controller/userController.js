const userModel = require('../models/UserModel')



const CreateUser = async (req, res) => {
    try {
        let data = req.body

        //Validation
        if (!data.name) return res.status(400).send({ status: false, message: "Name require" })
        if (!data.email) return res.status(400).send({ status: false, message: "email require" })
        if (!data.password) return res.status(400).send({ status: false, message: "password require" })
        let email = await userModel.findOne({ email: data.email })
        if (email) return res.status(404).send({ status: false, message: "Email already exist!" })

        //Creating documment
        const savedData = await userModel.create(data)
        res.status(201).send({ status: true, message: savedData })

    }
    catch (error) {
        //collecting backend error
        res.status(500).send({ stauts: false, message: error.message })

    }
}

module.exports.CreateUser = CreateUser