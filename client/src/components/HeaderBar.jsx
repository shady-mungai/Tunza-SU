import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContexts';

const HeaderBar = () => {
  const { user } = useAuth();

  // Fallback logic for admission number
  let admissionOrEmail = user?.admission_number || user?.email || user?.id || '';

  return (
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
        <Text className="text-gray-400 text-xl">👤</Text>
        <View className="items-end">
          <Text className="font-semibold text-gray-900">{user?.name || 'User'}</Text>
          <Text className="text-xs text-gray-500">{admissionOrEmail}</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderBar; 