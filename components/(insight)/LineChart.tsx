import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { format } from "date-fns";
import { skip } from "node:test";

// Add this type definition
type DataPoint = {
  sum: number;
  count: number;
};

// Reusable function to calculate averages from any map with the specified structure
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

  // Map {"Sun" => {"count": 0, "sum": 0}, "Mon" => {"count": 0, "sum": 0}, "Tue" => {"count": 0, "sum": 0}, "Wed" => {"count": 0, "sum": 0}, "Thu" => {"count": 0, "sum": 0}, "Fri" => {"count": 0, "sum": 0}, "Sat" => {"count": 0, "sum": 0}}
  const weeklyData = new Map(
    weekdays.map((day) => [day, { sum: 0, count: 0 }])
  );

  const monthlyData = new Map<string, DataPoint>();

  // Map {"Jan" => {"count": 0, "sum": 0}, "Feb" => {"count": 0, "sum": 0}, "Mar" => {"count": 0, "sum": 0}, "Apr" => {"count": 0, "sum": 0}, "May" => {"count": 0, "sum": 0}, "Jun" => {"count": 0, "sum": 0}, "Jul" => {"count": 0, "sum": 0}, "Aug" => {"count": 0, "sum": 0}, "Sep" => {"count": 0, "sum": 0}, "Oct" => {"count": 0, "sum": 0}, "Nov" => {"count": 0, "sum": 0}, "Dec" => {"count": 0, "sum": 0}}
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

  // Calculate averages using the reusable function
  const averages = calculateAverages(
    timeframe === "week"
      ? weeklyData
      : timeframe === "month"
      ? monthlyData
      : yearlyData
  );

  console.log(averages);

  return (
    <>
      <LineChart
        // data.map()
        data={{
          labels: Array.from(averages.entries()).map(([label]) => label),
          datasets: [
            {
              data: Array.from(averages.entries()).map(([_, avg]) => avg),
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
    </>
  );
}
