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
    const { userId, startDate, endDate } = req.query;

    if (!userId || !startDate || !endDate) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Set time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    console.log("Querying journals:", {
      userId,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

    const journals = await Journal.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).lean();

    console.log(`Found ${journals.length} journals`);

    // Process mood data
    const moodStats = {
      totalEntries: 0,
      moodCounts: {} as Record<string, number>,
      mostFrequentMood: "",
      averageMoodScore: 0,
      moodTrend: [] as Array<{ date: string; mood: string }>,
    };

    const moodScores = {
      Angry: 1,
      Sad: 2,
      Neutral: 3,
      Happy: 4,
      Joyful: 5,
    };

    // Process journals
    journals.forEach((journal) => {
      journal.entries.forEach((entry: any) => {
        // Count moods
        moodStats.moodCounts[entry.mood] =
          (moodStats.moodCounts[entry.mood] || 0) + 1;
        moodStats.totalEntries++;

        // Track mood trend
        moodStats.moodTrend.push({
          date: new Date(journal.date).toISOString(),
          mood: entry.mood,
        });
      });
    });

    // Calculate statistics if there are entries
    if (moodStats.totalEntries > 0) {
      // Find most frequent mood
      moodStats.mostFrequentMood = Object.entries(moodStats.moodCounts).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      )[0];

      // Calculate average mood score
      const totalScore = Object.entries(moodStats.moodCounts).reduce(
        (sum, [mood, count]) =>
          sum + moodScores[mood as keyof typeof moodScores] * count,
        0
      );
      moodStats.averageMoodScore = totalScore / moodStats.totalEntries;
    }

    res.json(moodStats);
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};

// GET /api/journal/insights
router.get("/journal/insights", insightsHandler);

// ... similar changes for POST and PUT

export default router;
