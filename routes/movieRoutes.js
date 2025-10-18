import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// 🎬 GET all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch movies', error });
    }
});

// 🎞️ GET single movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch movie', error });
    }
});

export default router;
