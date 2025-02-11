import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Polygon, Line, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const HEX_SIZE = width * 0.8; // Make it bigger

interface MoodStat {
  label: string;
  value: number; // 0 to 1
}

const HexStat = () => {
  const size = HEX_SIZE;
  const center = { x: size / 2, y: size / 2 };
  const radius = size * 0.35;

  // Example mood stats (you should replace these with your actual data)
  const moodStats: MoodStat[] = [
    { label: "Joyful", value: 0.8 },
    { label: "Happy", value: 0.6 },
    { label: "Neutral", value: 0.7 },
    { label: "Sad", value: 0.3 },
    { label: "Angry", value: 0.2 },
  ];

  const getPoint = (index: number, value: number = 1) => {
    const angle = ((Math.PI * 2) / 5) * index - Math.PI / 2;
    return {
      x: center.x + radius * value * Math.cos(angle),
      y: center.y + radius * value * Math.sin(angle),
    };
  };

  const outerPoints = Array.from({ length: 5 }, (_, i) => {
    const point = getPoint(i);
    return `${point.x},${point.y}`;
  }).join(" ");

  const statPoints = Array.from({ length: 5 }, (_, i) => {
    const value = moodStats[i]?.value || 0;
    const point = getPoint(i, value);
    return `${point.x},${point.y}`;
  }).join(" ");

  // Generate points for 3 inner polygons (25%, 50%, 75%)
  const innerPolygons = [0.25, 0.5, 0.75].map((scale) =>
    Array.from({ length: 5 }, (_, i) => {
      const point = getPoint(i, scale);
      return `${point.x},${point.y}`;
    }).join(" ")
  );

  return (
    <View className="flex-1 items-center justify-center mt-8">
      <Svg width={size} height={size}>
        {/* Background polygons */}
        {innerPolygons.map((points, i) => (
          <Polygon
            key={`inner-${i}`}
            points={points}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Outer pentagon */}
        <Polygon
          points={outerPoints}
          fill="none"
          stroke="#E5E7EB"
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
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Stat polygon */}
        <Polygon
          points={statPoints}
          fill="#008888"
          fillOpacity="0.2"
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
              fill="#4B5563"
              fontSize="14"
              fontWeight="bold"
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
