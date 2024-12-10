import Movie from "../models/Movie.js";

// Utility to handle errors
const handleError = (res, error, status = 500) => res.status(status).json({ error: error.message });

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const movie = await new Movie(req.body).save();
    res.json(movie);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all movies
const getAllMovies = async (_, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a movie by ID
const getSpecificMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    movie
      ? res.json(movie)
      : handleError(res, new Error("Movie not found"), 404);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    movie
      ? res.json(movie)
      : handleError(res, new Error("Movie not found"), 404);
  } catch (error) {
    handleError(res, error);
  }
};

// Add a review to a movie
const movieReview = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return handleError(res, new Error("Movie not found"), 404);

    const alreadyReviewed = movie.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return handleError(res, new Error("Movie already reviewed"), 400);

    const { rating, comment } = req.body;
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    movie.reviews.push(review);
    movie.numReviews = movie.reviews.length;
    movie.avgrating = movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.numReviews;

    await movie.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    movie
      ? res.json({ message: "Movie deleted successfully" })
      : handleError(res, new Error("Movie not found"), 404);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a review
const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return handleError(res, new Error("Movie not found"), 404);

    const reviewIndex = movie.reviews.findIndex((r) => r._id.toString() === reviewId);
    if (reviewIndex === -1) return handleError(res, new Error("Comment not found"), 404);

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    movie.avgrating = movie.numReviews
      ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.numReviews
      : 0;

    await movie.save();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Get latest movies
const getNewMovies = async (_, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(10);
    res.json(movies);
  } catch (error) {
    handleError(res, error);
  }
};

// Get top-rated movies
const getTopMovies = async (_, res) => {
  try {
    const movies = await Movie.find().sort({ numReviews: -1 }).limit(10);
    res.json(movies);
  } catch (error) {
    handleError(res, error);
  }
};

// Get random movies
const getRandomMovies = async (_, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 10 } }]);
    res.json(movies);
  } catch (error) {
    handleError(res, error);
  }
};

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
