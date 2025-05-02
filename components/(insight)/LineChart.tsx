import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { format } from "date-fns";
import { skip } from "node:test";


type DataPoint = {
  sum: number;
  count: number;
};


const calculateAverages = (data: Map<string, DataPoint>) => {
  return new Map(
    Array.from(data.entries()).map(([label, values]) => {
      const average = values.count
        ? Number((values.sum / values.count).toFixed(2))
        : 0;
      return [label, average];
    })
  );
};

console.log;
export default function MoodTrends({
  data,
  timeframe,
}: {
  data: any;
  timeframe: string;
}) {
  const customLabel = (date: string) => {
    return (
      <View className=" ml-2 top-28 ">
        <Text className="font-nunito-bold text-sm">{date}</Text>
      </View>
    );
  };

  console.log(timeframe);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  
  const weeklyData = new Map(
    weekdays.map((day) => [day, { sum: 0, count: 0 }])
  );

  const monthlyData = new Map<string, DataPoint>();

  
  const yearlyData = new Map(
    months.map((month) => [month, { sum: 0, count: 0 }])
  );
  console.log(yearlyData);
  const moodScores = (mood: string) => {
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
    }
  };

  const GraphData = data;

  // Process the data
  GraphData.forEach((entry: any) => {
    entry.entries.forEach((moodEntry: any) => {
      switch (timeframe) {
        case "week":
          const dayData = weeklyData.get(weekdays[moodEntry.dayIndex]);
          if (dayData) {
            dayData.sum += moodScores(moodEntry.mood)!;
            dayData.count += 1;
          }
          break;

        // console.log(format(new Date("2023-12-31T16:00:00.000Z"), "MMM-dd"));
        case "month":
          const day = format(new Date(entry.date), "MMM-dd");
          if (!monthlyData.has(day)) {
            monthlyData.set(day, { sum: 0, count: 0 });
          }
          monthlyData.get(day)!.sum += moodScores(moodEntry.mood)!;
          monthlyData.get(day)!.count += 1;
          break;

        case "year":
          const month = format(new Date(entry.date), "MMM");
          if (!yearlyData.has(month)) {
            yearlyData.set(month, { sum: 0, count: 0 });
          }
          yearlyData.get(month)!.sum += moodScores(moodEntry.mood)!;
          yearlyData.get(month)!.count += 1;
          break;
      }
    });
  });


  const averages = Array.from(
    calculateAverages(
      timeframe === "week"
        ? weeklyData
        : timeframe === "month"
        ? monthlyData
        : yearlyData
    ).entries()
  ).filter(([_, value]) => value !== 0);

  console.log(averages);

  return (
    <>
      <LineChart
        data={{
          labels: averages.map(([label]) => label),
          datasets: [
            {
              data: averages.map(([_, avg]) => avg),
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
        fromNumber={5}
        segments={0}
        renderDotContent={({ x, y, index, indexData }) => {
          if (indexData === null) return null;
          const score = indexData as number;
          const dotColor =
            score === 5
              ? "#2E7D32"
              : score >= 4
              ? "#66BB6A"
              : score >= 3
              ? "#FDD835"
              : score >= 2
              ? "#FB8C00"
              : score >= 1
              ? "#D32F2F"
              : "#9E9E9E";

          return (
            <View
              key={index}
              style={{
                position: "absolute",
                left: x - 4,
                top: y - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: score < 1 ? "transparent" : dotColor,
                borderWidth: 1,
                borderColor: dotColor,
              }}
            />
          );
        }}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 136, 136, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#008888",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e3e3e3",
          },
        }}
        style={{
          marginVertical: 20,

          borderRadius: 10,
        }}
        bezier
      />

      {/* Mood Legend */}
      <View className="flex-row flex-wrap justify-center mt-4 gap-4">
        {[
          { mood: "Joyful", score: 5, color: "#2E7D32" },
          { mood: "Happy", score: 4, color: "#66BB6A" },
          { mood: "Neutral", score: 3, color: "#FDD835" },
          { mood: "Sad", score: 2, color: "#FB8C00" },
          { mood: "Angry", score: 1, color: "#D32F2F" },
        ].map(({ mood, color }) => (
          <View key={mood} className="flex-row items-center">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: color,
                marginRight: 4,
              }}
            />
            <Text className="font-nunito text-sm">{mood}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
