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
// router.get('/:id', async (req, res) => {
//     try {
//         const booking = await MovieBooking.findById(req.params.id)
//             .populate('userId', 'name email')
//             .populate('movieId', 'title genre');
//         if (!booking) return res.status(404).json({ message: 'Booking not found' });
//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch booking', error });
//     }
// });

// routes/bookingRoutes.js

// Fetch booked seats for a movie, date, and showtime
router.get("/booked-seats", async (req, res) => {
  try {
    let { movieId, date, showTime } = req.query;

    console.log("Incoming query:", { movieId, date, showTime });

    //  1. Validate required fields
    if (!movieId || !date || !showTime) {
      return res.status(400).json({ message: "Missing required fields (movieId, date, showTime)" });
    }

   


    //  4. Query confirmed bookings
    // const bookings = await MovieBooking.find({
    //   movieId: "68f434e1b99bb8b44793e030",
    //   bookingDate: "20 Oct",
    //   showTime: "11:00 AM",
    //   bookingStatus: "confirmed",
    // });
    const bookings = await MovieBooking.find({
      movieId,
      bookingDate: date,
      showTime,
      bookingStatus: "confirmed",
    });

    // console.log("Bookings found:", bookings);

    //  5. Collect booked seats safely
    const bookedSeats = bookings.flatMap((booking) =>
      booking.seats.map((seat) => `${seat.row}${seat.num}`)
    );

    // console.log("Booked seats:", bookedSeats);

    res.status(200).json({ bookedSeats });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to fetch booked seats", error });
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
router.post("/create", authenticate, async (req, res) => {
  try {
    const { movieId, showTime, seats, totalAmount, bookingDate } = req.body;

    if (!movieId || !showTime || !seats?.length || !totalAmount || !bookingDate) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    const booking = await MovieBooking.create({
      userId: req.user.id,
      movieId,
      showTime,
      seats,
      totalAmount,
      bookingDate,
      bookingStatus: "confirmed",
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
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
