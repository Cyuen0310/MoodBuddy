import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-gifted-charts";
import LineChart from "./LineChart";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/(auth)/auth';

const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;

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
  const [rawData, setRawData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("UID:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("Not Logged In");
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const processMoodData = (data: any): MoodData => {
    const moodScores = {
      Angry: -5,
      Sad: -2,
      Neutral: 0,
      Happy: 2,
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
      /*console.log("Date Range:", {
        timeframe,
        start: dateRange.start.toLocaleString(),
        end: dateRange.end.toLocaleString(),
       });*/
      const response = await fetch(
        `http://${ipAddress}:3000/api/journal/insights?userId=${userId}&startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const journals = await response.json();

      journals.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Log raw journal entries
      setRawData(
        journals.map((journal: any) => ({
          date: journal.date,
          entries: journal.entries.map((entry: any) => ({
            mood: entry.mood,
            time: entry.time,
            text: entry.text,
            factors: entry.factors,
            dayIndex: new Date(journal.date).getDay(),
          })),
        }))
      );

      const processedData = processMoodData(journals);
      // console.log(processedData);

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
    }, [timeframe, dateRange, userId])
  );
  useEffect(() => {
    if (userId) {
      fetchMoodData();
    }
  }, [timeframe, userId]);

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
        className="flex-1 pb-24"
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

          {/* Summary Stats 
          <View className="bg-[#008888] rounded-lg p-4 mb-4 w-full">
            <Text className="font-nunito-bold text-base mb-2">Summary</Text>
            <Text>Total Entries: {moodData.totalEntries}</Text>
            <Text>Most Frequent: {moodData.mostFrequentMood}</Text>
            <Text>Average Score: {moodData.averageMoodScore.toFixed(1)}/5</Text>
          </View>
          */}

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
                        marginRight: 4,
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
            <Text className="font-nunito-bold text-xl mb-4 text-[#008888]">
              Mood Trend - {timeframe}
            </Text>
            <View className="items-center ">
              <LineChart data={rawData} timeframe={timeframe} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MoodInsights;
