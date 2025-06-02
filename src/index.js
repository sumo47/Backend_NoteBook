const mongoose = require('mongoose')
const express = require('express')
const routes = require('./Routes/Route.js')
const cors = require('cors')

const app = express()

mongoose.connect("mongodb+srv://sumit:sumit@cluster0.8dflsuw.mongodb.net/notebook")
    .then(() => { console.log("MongoDb connected successfully") })
    .catch((err) => { console.log(err) })

app.use(express.json())
app.use(cors())

app.use('/', routes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("server running on port", PORT)
})