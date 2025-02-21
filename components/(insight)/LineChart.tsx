import { LineChartBicolor } from "react-native-gifted-charts";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function MoodTrends({ data }: { data: any }) {
  const customLabel = (date: string) => {
    return (
      <View className=" ml-2 top-28 ">
        <Text className="font-nunito-bold text-sm">{date}</Text>
      </View>
    );
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = new Map(days.map((day) => [day, { sum: 0, count: 0 }]));
  const monthlyScores = new Map<string, number>();
  const yearlyScores = new Map<string, number>();
  const moodScores = (mood: string): number => {
    switch (mood) {
      case "Joyful":
        return 5;
      case "Happy":
        return 4;
      case "Neutral":
        return 3;
      case "Sad":
        return 2;
      case "Angry":
        return 1;
      default:
        return 0;
    }
  };
  // Parse the JSON string and access the data
  const parsedData = data;

  // Now you can access the entries like:

  parsedData.forEach((entry: any) => {
    entry.entries.forEach((moodEntry: any) => {
      const dayData = weeklyData.get(days[moodEntry.dayIndex]);
      if (dayData) {
        dayData.sum += moodScores(moodEntry.mood);
        dayData.count += 1;
      }
    });
  });

  // Calculate averages
  const weeklyAverages = new Map(
    days.map((day) => {
      const dayData = weeklyData.get(day);
      const average = dayData?.count ? dayData.sum / dayData.count : 0;
      return [day, average];
    })
  );

  console.log(weeklyAverages);

  return (
    <>
      <LineChart
        data={{
          labels: Array.from(weeklyAverages.entries()).map(([day]) => day),
          datasets: [
            {
              data: Array.from(weeklyAverages.entries()).map(([_, avg]) => avg),
              color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 30}
        height={220}
        withHorizontalLabels={false}
        withHorizontalLines={false}
        fromZero={true}
        segments={0}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#008888",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e3e3e3",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 10,
        }}
        bezier
      />
    </>
  );
}
