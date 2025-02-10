const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mood: {
      type: String,
      enum: ["Angry", "Sad", "Neutral", "Happy", "Joyful"],
      required: true,
    },
    factors: [
      {
        type: String,
        enum: [
          "Family",
          "Friends",
          "Love",
          "Academics",
          "Financial",
          "Weather",
          "Sleep",
        ],
      },
    ],
    text: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String, // URLs of images
        required: false,
      },
    ],
    time: {
      type: String, // For storing the HH:mm format time
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add validation for maximum number of factors
journalSchema.pre("save", function (next) {
  if (this.factors && this.factors.length > 3) {
    next(new Error("Maximum of 3 factors allowed"));
  } else {
    next();
  }
});

// Add validation for maximum number of images
journalSchema.pre("save", function (next) {
  if (this.images && this.images.length > 3) {
    next(new Error("Maximum of 3 images allowed"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Journal", journalSchema);
