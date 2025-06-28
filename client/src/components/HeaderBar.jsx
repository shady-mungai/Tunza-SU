import React from 'react';
import { View, Text } from 'react-native';

const HeaderBar = () => (
  <View className="flex-row items-center justify-between bg-white h-16 px-6 border-b border-gray-200">
    <View className="flex-row items-center space-x-3">
      <View className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
        <Text className="text-white font-bold text-lg">T</Text>
      </View>
      <View>
        <Text className="text-xl font-bold text-blue-900">TunzaSU</Text>
        <Text className="text-xs text-gray-500 -mt-1">Student Dashboard</Text>
      </View>
    </View>
    <View className="flex-row items-center space-x-6">
      <Text className="text-gray-400 text-xl">🔔</Text>
      <Text className="text-gray-400 text-xl">👤</Text>
      <View className="items-end">
        <Text className="font-semibold text-gray-900">Jane Student</Text>
        <Text className="text-xs text-gray-500">ADM2024001</Text>
      </View>
    </View>
  </View>
);

export default HeaderBar; 