import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  BarChart,
  LineChart,
  LineChartBicolor,
  PieChart,
} from "react-native-gifted-charts";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
  const [refreshing, setRefreshing] = useState(false);
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [selectedMood, setSelectedMood] = useState<{
    mood: string;
    percentage: string;
  } | null>(null);

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

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      console.log("Date Range:", {
        start: dateRange.start.toLocaleString(),
        end: dateRange.end.toLocaleString(),
      });
      const response = await fetch(
        `${API_URL}/journal/insights?userId=test&startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const journals = await response.json();
      console.log("Raw fetched data:", journals);

      const processedData = processMoodData(journals);
      console.log("Processed mood data:", {
        totalEntries: processedData.totalEntries,
        moodCounts: processedData.moodCounts,
        mostFrequentMood: processedData.mostFrequentMood,
        averageMoodScore: processedData.averageMoodScore,
      });

      setMoodData(processedData);
    } catch (error) {
      console.error("Failed to fetch mood data:", error);
      setMoodData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMoodData();
  }, [timeframe, dateRange]);

  // Refresh data when screen comes into focus or when timeframe/dateRange changes
  useFocusEffect(
    React.useCallback(() => {
      fetchMoodData();
    }, [timeframe, dateRange])
  );

  if (loading && !refreshing) {
    return (
      <View className="p-4 items-center justify-center">
        <ActivityIndicator size="large" color="#008888" />
      </View>
    );
  }

  if (!moodData || moodData.totalEntries === 0) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          <Text className="text-center text-gray-500">
            No mood data available for this {timeframe}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ width: Dimensions.get("window").width }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        horizontal={false}
        bounces={false}
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
        scrollEventThrottle={16}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 w-full">
          <Text className="font-nunito-bold text-lg mb-4">
            Mood Insights - {timeframe}
          </Text>

          {/* Summary Stats */}
          <View className="bg-[#008888] rounded-lg p-4 mb-4 w-full">
            <Text className="font-nunito-bold text-base mb-2">Summary</Text>
            <Text>Total Entries: {moodData.totalEntries}</Text>
            <Text>Most Frequent: {moodData.mostFrequentMood}</Text>
            <Text>Average Score: {moodData.averageMoodScore.toFixed(1)}/5</Text>
          </View>

          {/* Mood Distribution Pie Chart */}
          <View className="bg-white rounded-lg p-4 mb-4 w-full">
            <Text className="font-nunito-bold text-xl mb-4 text-[#008888]">
              Mood Distribution - {timeframe}
            </Text>
            <View className="items-center">
              <PieChart
                data={Object.entries(moodData.moodCounts).map(
                  ([mood, count], index) => ({
                    value: count,
                    text: `${mood} (${(
                      (count / moodData.totalEntries) *
                      100
                    ).toFixed(0)}%)`,
                    color:
                      mood === "Joyful"
                        ? "#2E7D32"
                        : mood === "Happy"
                        ? "#66BB6A"
                        : mood === "Neutral"
                        ? "#FDD835"
                        : mood === "Sad"
                        ? "#FB8C00"
                        : "#D32F2F",
                    label: mood,
                  })
                )}
                sectionAutoFocus={false}
                radius={90}
                innerRadius={60}
                centerLabelComponent={() => {
                  return (
                    <View>
                      <Text className="text-center text-[#333333] text-lg font-nunito">
                        Total
                      </Text>
                      <Text className="text-center text-[#333333] text-3xl font-nunito-bold">
                        {moodData.totalEntries}
                      </Text>
                    </View>
                  );
                }}
              />
              {/* Legend */}
              <View className="flex-row flex-wrap justify-center mt-4 gap-4">
                {["Joyful", "Happy", "Neutral", "Sad", "Angry"].map((mood) => (
                  <View key={mood} className="flex-row items-center">
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          mood === "Joyful"
                            ? "#2E7D32"
                            : mood === "Happy"
                            ? "#66BB6A"
                            : mood === "Neutral"
                            ? "#FDD835"
                            : mood === "Sad"
                            ? "#FB8C00"
                            : "#D32F2F",
                        marginRight: 4,
                      }}
                    />
                    <Text className="font-nunito">
                      {mood}:{" "}
                      {moodData.moodCounts[mood]
                        ? (
                            (moodData.moodCounts[mood] /
                              moodData.totalEntries) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Line Chart */}
          <View className="bg-white rounded-lg p-4 mb-4 w-full">
            <Text className="font-nunito-bold text-base mb-4 text-[#008888]">
              Mood Trend - {timeframe}
            </Text>
            <View className="items-center">
              <LineChartBicolor
                data={[
                  { value: 0, dataPointText: "0" },
                  { value: 10, dataPointText: "10" },
                  { value: 8, dataPointText: "8" },
                  { value: 58, dataPointText: "58" },
                  { value: -11, dataPointText: "56" },
                  { value: 78, dataPointText: "-4" },
                  { value: 74, dataPointText: "74" },
                  { value: 98, dataPointText: "98" },
                ]}
                areaChart
                color="green"
                colorNegative="red"
                startFillColor="green"
                startFillColorNegative="red"
                disableScroll={true}
                isAnimated={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MoodInsights;
