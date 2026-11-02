import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, Plus } from 'lucide-react-native';
import { colors } from '../theme/tokens';


const QuickActions = ({ onNewReport }) => {
  const navigation = useNavigation();

  return (
  <View className="bg-white rounded-2xl p-6 mb-6 flex flex-col border border-gray-200">
    <Text className="font-bold text-lg mb-4 text-gray-900">Quick Actions</Text>
    <View className="flex-row space-x-4">
      <TouchableOpacity
        className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-6 mr-2 bg-white"
        onPress={onNewReport}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Create a new maintenance report"
      >
        <Plus size={24} color={colors.brand} style={{ marginBottom: 8 }} />
        <Text className="font-semibold text-gray-900">New Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-6 mr-2 bg-white"
        onPress={() => navigation.navigate('MyReports')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="View my maintenance reports"
      >
        <Eye size={24} color={colors.brand} style={{ marginBottom: 8 }} />
        <Text className="font-semibold text-gray-900">View Reports</Text>
      </TouchableOpacity>

    </View>
  </View>
);
}

export default QuickActions;
