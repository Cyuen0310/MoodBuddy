import express, { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import connectDB from "../mongodb";
import Journal from "../models/journal";

// Define types for journal entry
interface JournalEntry {
  mood: string;
  factors: string[];
  text?: string;
  images?: string[];
  time: string;
}

// Define type for request body
interface JournalRequestBody {
  userId: string;
  date: string;
  entries: JournalEntry[];
}

// Add type for query params
interface InsightsQuery {
  userId?: string;
  timeframe?: string;
}

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

// Add new endpoint for insights
const insightsHandler: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { userId, timeframe } = req.query;

    if (!userId || !timeframe) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "week":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const journals = await Journal.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    console.log("Found insights data:", {
      timeframe,
      count: journals.length,
      dateRange: { startDate, endDate },
    });

    // Ensure we're sending valid JSON
    res.setHeader("Content-Type", "application/json");
    res.json(journals);
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};

// GET /api/journal/insights
router.get("/journal/insights", insightsHandler);

// ... similar changes for POST and PUT

export default router;
