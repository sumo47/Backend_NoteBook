const mongoose = require('mongoose')
const userModel = require('../models/UserModel')
const pageModel = require('../models/PageModel')

// Create a new page
const createPage = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const { title } = req.body
        const userId = req.decode.userId

        if (!title) return res.status(400).send({ status: false, message: "Title is required" })

        const user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(401).send({ status: false, message: "You are not authorized, user does not exist" })

        const page = await pageModel.create({
            title,
            user: userId
        })

        res.status(201).send({ status: true, message: page })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// Get all pages for a user
const getPages = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const userId = req.decode.userId

        const pages = await pageModel.find({ user: userId })
        
        res.status(200).send({ status: true, message: pages })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// Update a page
const updatePage = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const { title } = req.body
        const pageId = req.params.pageId
        const userId = req.decode.userId

        if (!title) return res.status(400).send({ status: false, message: "Title is required" })
        if (!mongoose.isValidObjectId(pageId)) return res.status(400).send({ status: false, message: "Invalid page ID" })

        const page = await pageModel.findById(pageId)
        if (!page) return res.status(404).send({ status: false, message: "Page not found" })
        
        if (page.user.toString() !== userId) return res.status(401).send({ status: false, message: "You are not authorized to update this page" })

        const updatedPage = await pageModel.findByIdAndUpdate(
            pageId,
            { title },
            { new: true }
        )

        res.status(200).send({ status: true, message: updatedPage })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// Delete a page
const deletePage = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        const pageId = req.params.pageId
        const userId = req.decode.userId

        if (!mongoose.isValidObjectId(pageId)) return res.status(400).send({ status: false, message: "Invalid page ID" })

        const page = await pageModel.findById(pageId)
        if (!page) return res.status(404).send({ status: false, message: "Page not found" })
        
        if (page.user.toString() !== userId) return res.status(401).send({ status: false, message: "You are not authorized to delete this page" })

        await pageModel.findByIdAndDelete(pageId)

        res.status(200).send({ status: true, message: "Page deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    createPage,
    getPages,
    updatePage,
    deletePage
} 