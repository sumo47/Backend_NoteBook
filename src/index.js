const mongoose = require('mongoose')
const express = require('express')
const app = express()

mongoose.connect("mongodb+srv://sumit:sumit@cluster0.8dflsuw.mongodb.net/notebook")
    .then(() => { console.log("MongoDb connected sucessfylly") })
    .catch((err) => { console.log(err) })

app.get('/', (req, res) => {
    res.send("Hellow world")
})

const PORT = 3000 || process.env.PORT

app.listen( PORT, () => {
    console.log("server running on port", PORT)
})
