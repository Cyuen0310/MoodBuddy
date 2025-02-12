import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

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
  moodPercentages: Record<string, number>;
  mostFrequentMood: string;
  averageMoodScore: number;
  dailyMoods: Array<{
    date: string;
    moodScore: number;
  }>;
}

const MoodInsights = ({
  timeframe,
  selectedDate,
  dateRange,
}: MoodInsightsProps) => {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodData | null>(null);

  const moodColors = {
    Angry: "#FF4D4D",
    Sad: "#7B68EE",
    Neutral: "#FFD700",
    Happy: "#98FB98",
    Joyful: "#32CD32",
  };

  const moodScores = {
    Angry: 1,
    Sad: 2,
    Neutral: 3,
    Happy: 4,
    Joyful: 5,
  };

  const processJournalData = (journals: any[]): MoodData => {
    const moodCounts: Record<string, number> = {};
    const dailyMoodScores: Record<string, number[]> = {};
    let totalEntries = 0;

    // Count moods and collect daily mood scores
    journals.forEach((journal) => {
      const date = new Date(journal.date).toISOString().split("T")[0];
      journal.entries.forEach((entry: any) => {
        // Count moods
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        totalEntries++;

        // Collect mood scores by date
        if (!dailyMoodScores[date]) {
          dailyMoodScores[date] = [];
        }
        dailyMoodScores[date].push(
          moodScores[entry.mood as keyof typeof moodScores]
        );
      });
    });

    // Calculate percentages
    const moodPercentages: Record<string, number> = {};
    Object.entries(moodCounts).forEach(([mood, count]) => {
      moodPercentages[mood] = (count / totalEntries) * 100;
    });

    // Calculate most frequent mood
    const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Calculate average mood score
    const totalScore = Object.entries(moodCounts).reduce(
      (sum, [mood, count]) =>
        sum + moodScores[mood as keyof typeof moodScores] * count,
      0
    );
    const averageMoodScore = totalScore / totalEntries;

    // Process daily mood scores into averages
    const dailyMoods = Object.entries(dailyMoodScores)
      .map(([date, scores]) => ({
        date,
        moodScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalEntries,
      moodCounts,
      moodPercentages,
      mostFrequentMood,
      averageMoodScore,
      dailyMoods,
    };
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
        const processedData = processJournalData(journals);
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

  const moodOrder = ["Angry", "Sad", "Neutral", "Happy", "Joyful"];

  const barChartData = {
    labels: moodOrder,
    datasets: [
      {
        data: moodOrder.map((mood) => moodData.moodCounts[mood] || 0),
      },
    ],
  };

  const lineChartData = {
    labels: moodData.dailyMoods.map((d) => d.date.slice(5)), // Show only MM-DD
    datasets: [
      {
        data: moodData.dailyMoods.map((d) => d.moodScore),
      },
    ],
  };

  const pieChartData = moodOrder
    .filter((mood) => moodData.moodCounts[mood] > 0)
    .map((mood) => ({
      name: mood,
      count: moodData.moodCounts[mood],
      color: moodColors[mood as keyof typeof moodColors],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

  return (
    <ScrollView className="p-4">
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

      {/* Bar Chart */}
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-nunito-bold text-base mb-2">
          Mood Distribution
        </Text>
        <BarChart
          data={barChartData}
          width={Dimensions.get("window").width - 48}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1, index) => {
              const mood = moodOrder[index || 0];
              return moodColors[mood as keyof typeof moodColors];
            },
            labelColor: () => "#333333",
            style: { borderRadius: 16 },
            propsForBackgroundLines: {
              strokeDasharray: "",
            },
          }}
        />
      </View>

      {/* Line Chart */}
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-nunito-bold text-base mb-2">Mood Trend</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get("window").width - 48}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          segments={4}
          fromZero
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
            labelColor: () => "#333333",
            style: { borderRadius: 16 },
            propsForBackgroundLines: {
              strokeDasharray: "",
            },
          }}
        />
      </View>

      {/* Pie Chart */}
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-nunito-bold text-base mb-2">Mood Breakdown</Text>
        <PieChart
          data={pieChartData}
          width={Dimensions.get("window").width - 48}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => "#333333",
            style: { borderRadius: 16 },
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

export default MoodInsights;
