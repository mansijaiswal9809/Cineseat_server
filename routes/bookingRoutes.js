import express from 'express';
import MovieBooking from '../models/movieBooking.js';
import Movie from '../models/movies.js';
import authenticate from '../middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await MovieBooking.find()
            .populate('userId', 'name email')
            .populate('movieId', 'title genre');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error });
    }
});

/* 
📌 2. GET booking by ID
*/
router.get('/:id', async (req, res) => {
    try {
        const booking = await MovieBooking.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('movieId', 'title genre');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch booking', error });
    }
});

/* 
📌 3. POST create a new booking
    Example body:
    {
        "userId": "670e9d1f8b4e0b2434524b6d",
        "movieId": "670e9f2c8b4e0b2434524b7a",
        "showTime": "2025-10-19T15:00:00Z",
        "seats": [{ "row": "A", "number": 5 }, { "row": "A", "number": 6 }],
        "totalAmount": 400
    }
*/
router.post('/', authenticate, async (req, res) => {
    try {
        const { userId, movieId, showTime, seats, totalAmount } = req.body;

        if (!userId || !movieId || !showTime || !seats || !totalAmount) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const newBooking = new MovieBooking({
            userId,
            movieId,
            showTime,
            seats,
            totalAmount,
            bookingStatus: 'confirmed'
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error });
    }
});

/* 
📌 4. PATCH cancel a booking
    Endpoint: /api/bookings/:id/cancel
*/
router.patch('/:id/cancel', async (req, res) => {
    try {
        const booking = await MovieBooking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        booking.bookingStatus = 'cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel booking', error });
    }
});

export default router;
