import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const QuickActions = ({ onNewReport }) => (
  <View className="bg-white rounded-2xl p-6 mb-6 flex flex-col border border-gray-200">
    <Text className="font-bold text-lg mb-4 text-gray-900">Quick Actions</Text>
    <View className="flex-row space-x-4">
      <TouchableOpacity
        className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-6 mr-2 bg-white"
        onPress={onNewReport}
        activeOpacity={0.8}
      >
        <Text className="text-2xl mb-2">＋</Text>
        <Text className="font-semibold text-gray-900">New Report</Text>
      </TouchableOpacity>
      <View className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-6 mr-2 bg-white">
        <Text className="text-2xl mb-2">👁️</Text>
        <Text className="font-semibold text-gray-900">View Reports</Text>
      </View>
      <View className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-6 bg-white">
        <Text className="text-2xl mb-2">📍</Text>
        <Text className="font-semibold text-gray-900">Map View</Text>
      </View>
    </View>
  </View>
);

export default QuickActions; 