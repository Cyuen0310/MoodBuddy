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
  const dailyScores = new Map<string, number>(days.map((day) => [day, 2]));

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
      const currentDayScores = dailyScores.get(days[moodEntry.dayIndex]) || 2;
      const newDayScores = currentDayScores + moodScores(moodEntry.mood);
      dailyScores.set(days[moodEntry.dayIndex], newDayScores);
    });
  });

  console.log(dailyScores);

  return (
    <>
      <LineChartBicolor
        data={Array.from(dailyScores.entries()).map(([day, score]) => ({
          value: score,
          labelComponent: () => customLabel(day),
        }))}
        color="green"
        colorNegative="red"
        startFillColor="green"
        startFillColorNegative="red"
        isAnimated={true}
        thickness={2}
        noOfSections={1}
        hideYAxisText
        spacing={45}
        initialSpacing={10}
      />

      <LineChart
        data={{
          labels: Array.from(dailyScores.entries()).map(([day]) => day),
          datasets: [
            {
              data: Array.from(dailyScores.entries()).map(
                ([_, score]) => score
              ),
              color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 30}
        height={220}
        withVerticalLabels={true}
        withHorizontalLabels={false}
        fromZero={true}
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
