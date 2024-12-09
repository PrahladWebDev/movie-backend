import Genre from "../models/Genre.js";

// Create a new genre
const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Genre name is required" });
    }

    // Check if the genre already exists
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ error: "Genre already exists" });
    }

    // Create and save the new genre
    const genre = new Genre({ name });
    const savedGenre = await genre.save();

    res.status(201).json(savedGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create genre" });
  }
};

// Update an existing genre
const updateGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // Find the genre by ID
    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    // Update the genre's name
    genre.name = name;
    const updatedGenre = await genre.save();

    res.json(updatedGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update genre" });
  }
};

// Delete a genre
const removeGenre = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the genre by ID
    const deletedGenre = await Genre.findByIdAndDelete(id);
    if (!deletedGenre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete genre" });
  }
};

// List all genres
const listGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
};

// Get details of a specific genre
const readGenre = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the genre by ID
    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch genre details" });
  }
};

export { createGenre, updateGenre, removeGenre, listGenres, readGenre };
