// models/Movie.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    image: {
        type: String,
        required: true
    },
    youtubeUrl:{
        type: String,
        required: true
    },
    cast: [{
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    }]
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
