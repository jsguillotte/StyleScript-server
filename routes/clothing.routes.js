//Require Packages / Packages Functionalities

const router = require("express").Router();

const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// Require Data Models
const Clothing = require("../models/Clothing.model");
const Note = require("../models/Note.model");
const User = require("../models/User.model");

//POST ROUTE that Creates a new Clothing
router.post("/clothing/create", isAuthenticated, async (req, res) => {
  const user = req.payload;
  const {
    title,
    image,
    type,
    color,
    brand,
    description,
    careInstructions,
    season,
  } = req.body;
  try {
    let newClothes = await Clothing.create({
      title,
      image,
      type,
      color,
      brand,
      description,
      careInstructions,
      season,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { userClothing: newClothes._id },
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//GET ROUTE that gets all the Clothings

router.get("/clothing", isAuthenticated, async (req, res) => {
  const user = req.payload;
  try {
    let allClothings = await User.findById(user._id).populate("userClothing");
    res.json(allClothings);
  } catch (error) {
    res.json(error);
  }
});

// GET Route that gets info of a specific Clothing
router.get("/clothing/:clothingId", async (req, res) => {
  const { clothingId } = req.params;
  try {
    let foundClothing = await Clothing.findById(clothingId).populate("note");
    res.json(foundClothing);
  } catch (error) {
    res.json(error);
  }
});

// HTTP Verbs: GET, POST, PUT, DELETE
// Since we're building a REST API, we're sending data via JSON and using HTTP REquests for communication

// PUT route to update info of a Clothing

router.put("/clothing/edit/:clothingId", async (req, res) => {
  const { clothingId } = req.params;
  const {
    title,
    image,
    type,
    color,
    brand,
    description,
    careInstructions,
    season,
  } = req.body;

  try {
    let updateClothing = await Clothing.findByIdAndUpdate(
      clothingId,
      {
        title,
        image,
        type,
        color,
        brand,
        description,
        careInstructions,
        season,
      },
      { new: true }
    );
    res.json(updateClothing);
  } catch (error) {
    res.json(error);
  }
});

// DELETE route to delete a Clothing
router.delete("/clothing/delete/:clothingId", async (req, res) => {
  const { clothingId } = req.params;

  try {
    await Clothing.findByIdAndDelete(clothingId);
    res.json({ message: "Clothing deleted" });
  } catch (error) {
    res.json(error);
  }
});

//create a note for a specific clothing
router.post("/note/create/:clothingId", isAuthenticated, async (req, res) => {
  const { clothingId } = req.params;
  const { content } = req.body;

  try {
    let newNote = await Note.create({ content, Clothing: clothingId });

    let response = await Clothing.findByIdAndUpdate(clothingId, {
      $push: { note: newNote._id },
    });

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//Create a route to delete a note
router.delete("/note/delete/:clothingId/:noteId", isAuthenticated, async (req, res) => {
  const { clothingId, noteId } = req.params;

  try {
    // Delete the note itself
    await Note.findByIdAndDelete(noteId);

    // Remove the note's reference from the clothing item
    await Clothing.findByIdAndUpdate(clothingId, { $pull: { note: noteId } });

    res.json({ message: "Note deleted" });
  } catch (error) {
    res.json(error);
  }
});

//Create a route to update a note

router.put("/note/update/:clothingId/:noteId", isAuthenticated, async (req, res) => {
  const { clothingId, noteId } = req.params;
  const { content } = req.body;

  try {
    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.json(error);
  }
});

// Add to Laundry
router.post("/:id/add-to-laundry", async (req, res) => {
  try {
    const clothingId = req.params.id;
    const updatedClothing = await Clothing.findByIdAndUpdate(
      clothingId,
      { $push: { laundry: "New Laundry Status" } },
      { new: true }
    );

    if (!updatedClothing) {
      return res.status(404).json({ message: "Clothing not found" });
    }

    res.json({ message: "Added to laundry", clothing: updatedClothing });
  } catch (error) {
    console.error("Error adding to laundry:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//display laundry list
router.get("/laundry", async (req, res) => {
  try {
    const laundry = await Clothing.find({ laundry: { $exists: true } });
    res.json(laundry);
  } catch (error) {
    console.error("Error getting laundry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Laundry
router.post("/:id/remove-from-laundry", async (req, res) => {
  try {
    const clothingId = req.params.id;
    const updatedClothing = await Clothing.findByIdAndUpdate(
      clothingId,
      { $pull: { laundry: "New Laundry Status" } },
      { new: true }
    );
    if (!updatedClothing) {
      return res.status(404).json({ message: "Clothing not found" });
    }
    res.json({ message: "Removed from laundry", clothing: updatedClothing });
  } catch (error) {
    console.error("Error removing from laundry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to Packing List
router.post("/:id/add-to-packing-list", async (req, res) => {
  try {
    const clothingId = req.params.id;
    const updatedClothing = await Clothing.findByIdAndUpdate(
      clothingId,
      { $push: { packingList: "New Packing List Status" } },
      { new: true }
    );
    if (!updatedClothing) {
      return res.status(404).json({ message: "Clothing not found" });
    }
    res.json({ message: "Added to packing list", clothing: updatedClothing });
  } catch (error) {
    console.error("Error adding to packing list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// display packing list

router.get("/packing-list", async (req, res) => {
  try {
    const packingList = await Clothing.find({ packingList: { $exists: true } });
    res.json(packingList);
  } catch (error) {
    console.error("Error getting packing list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Packing List
router.post("/:id/remove-from-packing-list", async (req, res) => {
  try {
    const clothingId = req.params.id;
    const updatedClothing = await Clothing.findByIdAndUpdate(
      clothingId,
      { $pull: { packingList: "New Packing List Status" } },
      { new: true }
    );
    if (!updatedClothing) {
      return res.status(404).json({ message: "Clothing not found" });
    }
    res.json({
      message: "Removed from packing list",
      clothing: updatedClothing,
    });
  } catch (error) {
    console.error("Error removing from packing list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Exporting Express Router with all its routes

module.exports = router;
