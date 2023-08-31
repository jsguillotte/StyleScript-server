//Require Packages / Packages Functionalities

const router = require('express').Router();

const mongoose = require('mongoose');

// Require Data Models
const Clothing = require('../models/Clothing.model');
const Note = require('../models/Note.model');


//POST ROUTE that Creates a new Clothing
router.post('/clothing/create', async (req,res)=>{
    const {title, img, brand,  description, careInstructions, laundry, season } = req.body;
    try{
        let response = await Clothing.create({title, img, brand, description, careInstructions, laundry, season});
        res.json(response)

    }
    catch (error) {
        res.json(error)
    }
})

//GET ROUTE that gets all the Clothings

router.get('/clothing', async(req,res)=>{
    try{
        let allClothings = await Clothing.find();
        res.json(allClothings)
    }
    catch(error){
        res.json(error)
    }
})

// GET Route that gets info of a specific Clothing
router.get('/clothing/:clothingId', async(req, res) => {
    const {clothingId} = req.params;
    try{
        let foundClothing = await Clothing.findById(clothingId).populate('note');
        res.json(foundClothing)
    }
    catch(error){
        res.json(error)

    }
})

// HTTP Verbs: GET, POST, PUT, DELETE
// Since we're building a REST API, we're sending data via JSON and using HTTP REquests for communication

// PUT route to update info of a Clothing

router.put('/clothing/:clothingId', async(req,res)=>{
    const {clothingId} = req.params;
    const {title, img, brand, description, careInstructions, laundry, season} =  req.body;

    try {
        let updateClothing = await Clothing.findByIdAndUpdate(clothingId, {title, img, brand, description, careInstructions, laundry, season}, {new: true}) 
        res.json(updateClothing)  
 }
 catch(error) {
    res.json(error)
 }
})

// DELETE route to delete a Clothing
router.delete('/clothing/delete/:clothingId', async(req,res)=>{
    const {clothingId} = req.params;

    try{
        await Clothing.findByIdAndDelete(clothingId);
        res.json({message: 'Clothing deleted'});
    }
    catch(error){
        res.json(error)
    }
})


//create a note for a specific clothing
router.post('/note/create/:clothingId', async(req, res)=>{

    const {clothingId} = req.params;
    const {content} = req.body;

    try{
        let newNote = await Note.create({content, Clothing: clothingId})

        let response = await Clothing.findByIdAndUpdate(clothingId, 
            {$push: {note: newNote._id}})

            res.json(response)
    }
    catch(error){
        res.json(error)
    }
})

//Create a route to delete a note
router.delete('/note/delete/:clothingId/:noteId', async(req, res)=>{
    const { clothingId, noteId } = req.params;

    try {
        // Delete the note itself
        await Note.findByIdAndDelete(noteId);

        // Remove the note's reference from the clothing item
        await Clothing.findByIdAndUpdate(clothingId, { $pull: { note: noteId } });

        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.json(error);
    }
})

//Create a route to update a note

router.put('/note/update/:clothingId/:noteId', async (req, res) => {
    const { clothingId, noteId } = req.params;
    const { content } = req.body;

    try {
        // Update the note
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { content},
            { new: true }
        );

        res.json(updatedNote);
    } catch (error) {
        res.json(error);
    }
});




// Exporting Express Router with all its routes

module.exports = router;
