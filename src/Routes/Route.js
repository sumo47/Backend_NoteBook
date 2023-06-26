const express = require('express')
const router = express.Router() // const router = express.router()
const userController = require('../controller/userController')


router.get("/test", (req, res) => {
    res.send("My First ever Api")
})

router.get("/", (req,res)=>{
    res.send("root", req.body)
})

router.post("/createUser", userController.CreateUser )
router.get("/login", userController.LoginUser)



module.exports = router // module.export = router 