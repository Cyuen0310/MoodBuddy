import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    entries: [
      {
        mood: {
          type: String,
          required: true,
        },
        factors: [String],
        text: String,
        images: [String],
        time: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;
