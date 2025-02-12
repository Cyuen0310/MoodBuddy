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
        text: {
          type: String,
          default: "",
        },
        images: {
          type: [String],
          default: [],
        },
        time: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

console.log("Creating Journal model with schema:", journalSchema.obj);

export default mongoose.models.Journal ||
  mongoose.model("Journal", journalSchema);
