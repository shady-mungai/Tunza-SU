import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContexts';
import { UserRound } from 'lucide-react-native';
import { colors } from '../theme/tokens';

const HeaderBar = () => {
  const { user } = useAuth();

  // Fallback logic for admission number
  let admissionOrEmail = user?.admission_number || user?.email || user?.id || '';

  return (
    <View className="flex-row items-center justify-between bg-white h-16 px-6 border-b border-gray-200">
      <View className="flex-row items-center space-x-3">
      </View>
      <View className="flex-row items-center space-x-6">
        <UserRound size={24} color={colors.textMuted} accessibilityLabel="User profile" />
        <View className="items-end">
          <Text className="font-semibold text-gray-900">{user?.name || 'User'}</Text>
          <Text className="text-xs text-gray-500">{admissionOrEmail}</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderBar;
