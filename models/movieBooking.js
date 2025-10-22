// models/MovieBooking.js
import mongoose from 'mongoose';

const movieBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    seats: [{
        row: String,
        num: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending'
    },
    bookingDate: {
        type: String,
        required: true
    }
}, { timestamps: true });

const MovieBooking = mongoose.model('MovieBooking', movieBookingSchema);
export default MovieBooking;
