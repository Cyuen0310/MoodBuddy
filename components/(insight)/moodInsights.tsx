import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-chart-kit";

const API_URL = "http://172.18.76.219:3000/api";

interface MoodInsightsProps {
  timeframe: "week" | "month" | "year";
}

const MoodInsights = ({ timeframe }: MoodInsightsProps) => {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<{
    labels: string[];
    data: number[];
  }>({ labels: [], data: [] });

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/journal/insights?timeframe=${timeframe}&userId=test`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const journals = await response.json();

        // Count moods
        const moodCounts: Record<string, number> = {};
        journals.forEach((journal: any) => {
          journal.entries.forEach((entry: any) => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
          });
        });

        // Sort moods in order: Angry, Sad, Neutral, Happy, Joyful
        const moodOrder = ["Angry", "Sad", "Neutral", "Happy", "Joyful"];
        const sortedMoods = moodOrder.filter((mood) => moodCounts[mood] > 0);
        const sortedCounts = sortedMoods.map((mood) => moodCounts[mood]);

        setMoodData({
          labels: sortedMoods,
          data: sortedCounts,
        });
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [timeframe]);

  if (loading) {
    return (
      <View className="p-4 items-center justify-center">
        <ActivityIndicator size="large" color="#008888" />
      </View>
    );
  }

  const chartData = {
    labels: moodData.labels,
    datasets: [{ data: moodData.data }],
  };

  return (
    <View className="p-4">
      <Text className="font-nunito-bold text-lg mb-4">
        Mood Distribution - {timeframe}
      </Text>
      {moodData.data.length > 0 ? (
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
            labelColor: () => "#333333",
            style: { borderRadius: 16 },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text className="text-center text-gray-500">
          No mood data available
        </Text>
      )}
    </View>
  );
};

export default MoodInsights;
