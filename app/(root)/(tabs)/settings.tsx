import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import icons from "@/constants/icons";

const ProfileItem = ({
  icon,
  itemName,
  onPress,
}: {
  icon: ImageSourcePropType;
  itemName: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center justify-between py-3"
      onPress={onPress}
    >
      <View className="flex flex-row items-center gap-3">
        <Image source={icon} className="size-6" />
        <Text
          className={`text-lg font-nunito-medium ${
            itemName === "Logout" ? "text-red-500" : "text-black-300"
          }`}
        >
          {itemName}
        </Text>
      </View>

      <Image
        source={itemName != "Logout" ? icons.rightArrow : null}
        className="size-5"
      />
    </TouchableOpacity>
  );
};

const settings = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-center mt-5">
          <Text className="text-2xl font-nunito-bold">Settings</Text>
        </View>

        <View className="flex flex-row items-center justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={icons.avatar}
              className="size-24  relative rounded-full xl:size-32"
            />
            <TouchableOpacity className="absolute left-safe-offset-0  bg-slate-300 rounded-full">
              <Image source={icons.close} className="size-5 " />
            </TouchableOpacity>
            <Text className="text-xl font-nunito-bold mt-2">User</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <ProfileItem
            icon={icons.person}
            itemName="Personal Information"
            onPress={() => router.push("/(settings)/userInfo")}
          />
          <ProfileItem icon={icons.bell} itemName="Notification" />
          <ProfileItem icon={icons.send} itemName="Contact Us" />
          <ProfileItem icon={icons.people} itemName="Invite Friends" />
          <ProfileItem
            icon={icons.shield}
            itemName="Privacy Policy"
            onPress={() => router.push("/(settings)/policies")}
          />
          <ProfileItem icon={icons.info} itemName="Terms & Conditions" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <ProfileItem
            icon={icons.logout}
            itemName="Logout"
            onPress={() => router.replace("/(auth)/Login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default settings;
