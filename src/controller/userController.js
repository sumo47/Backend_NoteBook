const userModel = require('../models/UserModel')
const bcrypt = require('bcryptjs');

const CreateUser = async (req, res) => {
    try {
        let data = req.body


        //Validation
        if (!data.name) return res.status(400).send({ status: false, message: "Name require" })
        if (!data.email) return res.status(400).send({ status: false, message: "email require" })
        if (!data.password) return res.status(400).send({ status: false, message: "password require" })
        let email = await userModel.findOne({ email: data.email })
        if (email) return res.status(404).send({ status: false, message: "Email already exist!" })

        // Creating secure password using bcrypt
        const salt = await bcrypt.genSalt(10) // Creating salt
        const secPass = await bcrypt.hash(data.password, salt) //creating hash form of password

        //Creating documment
        const savedData = await userModel.create({ name: data.name, email: data.email, password: secPass })
        res.status(201).send({ status: true, message: savedData })

    }
    catch (error) {
        //collecting backend error
        res.status(500).send({ stauts: false, message: error.message })

    }
}

module.exports.CreateUser = CreateUser