const express = require('express')
const router = express.Router() // const router = express.router()
const { CreateUser, LoginUser, getUser } = require('../controller/userController')
const {auth} = require('../middleware/Authentication')


router.get("/test", (req, res) => {
    res.send("My First ever Api")
})

router.get("/", (req, res) => {
    res.send("root", req.body)
})

router.post("/createUser", CreateUser)
router.get("/login", LoginUser)
router.get('/getUser',auth, getUser)


module.exports = router // module.export = router 