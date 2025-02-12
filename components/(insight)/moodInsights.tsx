import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";

const API_URL = "http://172.18.76.219:3000/api";

interface MoodInsightsProps {
  timeframe: "week" | "month" | "year";
  selectedDate: Date;
  dateRange: {
    start: Date;
    end: Date;
  };
}

interface MoodData {
  totalEntries: number;
  moodCounts: Record<string, number>;
  mostFrequentMood: string;
  averageMoodScore: number;
}

const MoodInsights = ({
  timeframe,
  selectedDate,
  dateRange,
}: MoodInsightsProps) => {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodData | null>(null);

  const processMoodData = (data: any): MoodData => {
    const moodScores = {
      Angry: 1,
      Sad: 2,
      Neutral: 3,
      Happy: 4,
      Joyful: 5,
    };

    const stats = {
      totalEntries: 0,
      moodCounts: {} as Record<string, number>,
      mostFrequentMood: "",
      averageMoodScore: 0,
    };

    // Process each journal entry
    data.forEach((journal: any) => {
      journal.entries.forEach((entry: any) => {
        stats.totalEntries++;
        stats.moodCounts[entry.mood] = (stats.moodCounts[entry.mood] || 0) + 1;
      });
    });

    // Calculate most frequent mood
    if (stats.totalEntries > 0) {
      stats.mostFrequentMood = Object.entries(stats.moodCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      // Calculate average mood score
      const totalScore = Object.entries(stats.moodCounts).reduce(
        (sum, [mood, count]) =>
          sum + moodScores[mood as keyof typeof moodScores] * count,
        0
      );
      stats.averageMoodScore = totalScore / stats.totalEntries;
    }

    return stats;
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/journal/insights?timeframe=${timeframe}&userId=test&startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const journals = await response.json();
        const processedData = processMoodData(journals);
        setMoodData(processedData);
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
        setMoodData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [timeframe, dateRange]);

  if (loading) {
    return (
      <View className="p-4 items-center justify-center">
        <ActivityIndicator size="large" color="#008888" />
      </View>
    );
  }

  if (!moodData || moodData.totalEntries === 0) {
    return (
      <View className="p-4">
        <Text className="text-center text-gray-500">
          No mood data available for this {timeframe}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      bounces={true}
      scrollEventThrottle={16}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <Text className="font-nunito-bold text-lg mb-4">
        Mood Insights - {timeframe}
      </Text>

      {/* Summary Stats */}
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-nunito-bold text-base mb-2">Summary</Text>
        <Text>Total Entries: {moodData.totalEntries}</Text>
        <Text>Most Frequent: {moodData.mostFrequentMood}</Text>
        <Text>Average Score: {moodData.averageMoodScore.toFixed(1)}/5</Text>
      </View>

      {/* Add your custom charts here */}
    </ScrollView>
  );
};

export default MoodInsights;
