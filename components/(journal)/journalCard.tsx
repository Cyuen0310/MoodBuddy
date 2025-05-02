import React from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";

interface JournalCardProps {
  info: {
    mood: string;
    factors: string[];
    text: string;
    images: string[];
    time?: string;
  };
}


const moodIcons: { [key: string]: any } = {
  Angry: icons.angry,
  Sad: icons.sad,
  Neutral: icons.neutral,
  Happy: icons.happy,
  Joyful: icons.joyful,
};


const factorColors: { [key: string]: string } = {
  Family: "bg-pink-200 text-pink-800",
  Friends: "bg-purple-200 text-purple-800",
  Love: "bg-red-200 text-red-800",
  Academics: "bg-blue-200 text-blue-800",
  Financial: "bg-green-200 text-green-800",
  Weather: "bg-yellow-200 text-yellow-800",
  Sleep: "bg-indigo-200 text-indigo-800",
};

const JournalCard = ({ info }: JournalCardProps) => {
  return (
    <View className="bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
      {info.images && info.images.length > 0 && (
        <View className="w-full h-48">
          <Image
            source={{ uri: info.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {info.images.length > 1 && (
            <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-nunito-bold">
                +{info.images.length - 1}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Image source={moodIcons[info.mood]} className="size-8 mr-2" />
            <Text className="font-nunito-bold text-lg">{info.mood}</Text>
          </View>
          {info.time && (
            <Text className="font-nunito-regular text-gray-500">
              {info.time}
            </Text>
          )}
        </View>


        {info.factors.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            {info.factors.map((factor, index) => (
              <View
                key={index}
                className={`rounded-full px-3 py-1 ${
                  factorColors[factor] || "bg-gray-200 text-gray-800"
                }`}
              >
                <Text className={`font-nunito-bold text-sm`}>{factor}</Text>
              </View>
            ))}
          </View>
        )}


        {info.text && (
          <Text className="font-nunito-regular text-gray-700">{info.text}</Text>
        )}
      </View>
    </View>
  );
};

export default JournalCard;
