const mongoose = require('mongoose')
const express = require('express')
const app = express()
const routes = require('./Routes/Route.js')
mongoose.connect("mongodb+srv://sumit:sumit@cluster0.8dflsuw.mongodb.net/notebook")
    .then(() => { console.log("MongoDb connected sucessfylly") })
    .catch((err) => { console.log(err) })

app.use(express.json())
app.use('/', routes)

const PORT = 3000 || process.env.PORT

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})
