import express, { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import connectDB from "../mongodb";
import Journal from "../models/journal";

const router = express.Router();

// GET /api/journal
router.get("/journal", async (req, res) => {
  try {
    await connectDB();
    const { userId, date } = req.query;

    console.log("GET /journal request:", { userId, date });

    // Parse the query date
    const queryDate = new Date(date as string);
    const startOfDay = new Date(queryDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Finding journals between:", {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    // Find journals for this day
    const journals = await Journal.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).lean();

    console.log("Found journals:", {
      count: journals.length,
      journals: journals.map((j) => ({
        id: j._id,
        date: j.date,
        entriesCount: j.entries.length,
      })),
    });

    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

// POST /api/journal
router.post("/journal", async (req, res) => {
  try {
    await connectDB();
    const { userId, date, entries } = req.body;

    console.log("Creating journal:", {
      userId,
      date,
      entries,
    });

    const journal = new Journal({
      userId,
      date: new Date(date),
      entries: entries.map((entry: any) => ({
        mood: entry.mood,
        factors: entry.factors,
        text: entry.text || "",
        images: entry.images || [],
        time: entry.time,
      })),
    });

    await journal.save();
    res.json(journal);
  } catch (error) {
    console.error("Error saving journal:", error);
    res.status(500).json({ error: "Failed to save journal" });
  }
});

// GET /api/journal/insights
router.get("/journal/insights", async (req, res) => {
  try {
    await connectDB();
    const { userId, startDate, endDate } = req.query;

    // Create dates in local timezone
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Adjust for timezone offset
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const journals = await Journal.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    res.json(journals);
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

export default router;
