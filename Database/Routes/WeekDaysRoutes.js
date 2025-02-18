const express = require("express");
const router = express.Router();
const moment = require("moment");
const TimingSlots = ["10:00", "12:00", "14:00", "16:00", "18:00"];

const BookedSlotes = [];

const GeneratTimeSlots = (date) => {
  return TimingSlots.map((time) => {
    const [hours, minutes] = time.split(":");
    const startTime = new Date(date);
    startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return {
      start_time: startTime.getTime(),
    };
  });
};

//get availabe time slots

// Generate time slots
const generateTimeSlots = () => [
  { start_time: "10:00" },
  { start_time: "12:00" },
  { start_time: "14:00" },
  { start_time: "16:00" },
  { start_time: "18:00" },
];

// Mock Booked Slots
const bookedSlots = [
  { date: "2025-02-12", start_time: "12:00" }, // Example booked slots
];

router.get("/timeslots", (req, res) => {
  const day = req.query.day;
  const dayId = day === "tomorrow" ? 2 : day === "dayAfterTomorrow" ? 3 : 1;

  // Get the current date using moment (timezone is already set in index.js)
  const today = moment();
  const timeSlots = [];

  if (dayId === 2 || dayId === 3) {
    // Return fixed time slots for tomorrow and day after tomorrow
    const selectedDate = today.clone().add(dayId - 1, "days").format("YYYY-MM-DD");

    timeSlots.push({
      date: selectedDate,
      slots: generateTimeSlots(),
    });
  } else if (dayId === 1) {
    // Get today's available slots based on the current time
    const now = moment();
    const currentHour = now.hour(); // Get current hour

    const availableSlots = generateTimeSlots()
      .filter((slot) => {
        const [slotHour] = slot.start_time.split(":").map(Number);
        return slotHour > currentHour; // Only show future slots
      })
      .filter((slot) => {
        // Remove already booked slots
        return !bookedSlots.some(
          (booked) =>
            booked.date === today.format("YYYY-MM-DD") &&
            booked.start_time === slot.start_time
        );
      });

    timeSlots.push({
      date: today.format("YYYY-MM-DD"),
      slots: availableSlots,
    });
  }

  res.json(timeSlots);
});

// book a time slots

router.post("/timeslots/book", (req, res) => {
  const { date, start_time, user_id } = req.body;

  if (!date || !start_time || !user_id) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  const isConflicts = BookedSlotes.some(
    (booked) => booked.date === date && (start_time = booked.start_time)
  );

  if (isConflicts) {
    return res.status(400).json({
      status: "error",
      message: "Slot is already booked",
    });
  }

  BookedSlotes.push({
    date,
    start_time,
    user_id,
  });
  res.json({
    status: "success",
    message: "Time slot booked successfully.",
  });
});

module.exports = router;
