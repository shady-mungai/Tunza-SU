import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const navItems = [
  { label: 'Dashboard', icon: '⚙️', route: 'Student Dash' },
  { label: 'My Reports', icon: '⚠️', route: 'My Reports' },
];

const SidebarNavigation = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-white rounded-2xl p-4 mt-6 ml-2 w-48 shadow border border-gray-200">
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          className="flex-row items-center px-3 py-2 mb-2 rounded-lg"
          onPress={() => navigation.navigate(item.route)}
          activeOpacity={0.7}
        >
          <Text className="mr-3 text-lg text-gray-500">{item.icon}</Text>
          <Text className="font-medium text-gray-700">{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SidebarNavigation; 