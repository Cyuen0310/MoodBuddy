import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Polygon, Line, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const HEX_SIZE = width * 0.3; // Adjust size based on screen width

interface MoodStat {
  label: string;
  value: number; // 0 to 1
}

const HexStat = () => {
  const size = 200; // You can adjust this
  const center = { x: size / 2, y: size / 2 };
  const radius = size * 0.4;

  // Example mood stats (you should replace these with your actual data)
  const moodStats: MoodStat[] = [
    { label: "Joyful", value: 0.8 },
    { label: "Happy", value: 0.6 },
    { label: "Neutral", value: 0.7 },
    { label: "Sad", value: 0.3 },
    { label: "Angry", value: 0.2 },
  ];

  // Calculate points for 5 corners of pentagon
  const getPoint = (index: number, value: number = 1) => {
    // Start from the top (- Math.PI / 2) and divide the circle into 5 parts
    const angle = ((Math.PI * 2) / 5) * index - Math.PI / 2;
    return {
      x: center.x + radius * value * Math.cos(angle),
      y: center.y + radius * value * Math.sin(angle),
    };
  };

  // Generate points for the outer pentagon
  const outerPoints = Array.from({ length: 5 }, (_, i) => {
    const point = getPoint(i);
    return `${point.x},${point.y}`;
  }).join(" ");

  // Generate points for the stat pentagon
  const statPoints = Array.from({ length: 5 }, (_, i) => {
    const value = moodStats[i]?.value || 0;
    const point = getPoint(i, value);
    return `${point.x},${point.y}`;
  }).join(" ");

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background pentagon */}
        <Polygon
          points={outerPoints}
          fill="none"
          stroke="#ddd"
          strokeWidth="1"
        />

        {/* Stat lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <Line
            key={`line-${i}`}
            x1={center.x}
            y1={center.y}
            x2={getPoint(i).x}
            y2={getPoint(i).y}
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}

        {/* Stat polygon */}
        <Polygon
          points={statPoints}
          fill="#008888"
          fillOpacity="0.5"
          stroke="#008888"
          strokeWidth="2"
        />

        {/* Labels */}
        {moodStats.map((stat, i) => {
          const point = getPoint(i, 1.2);
          return (
            <SvgText
              key={`text-${i}`}
              x={point.x}
              y={point.y}
              fill="#666"
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {stat.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

export default HexStat;
