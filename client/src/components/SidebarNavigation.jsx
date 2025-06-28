import React from 'react';
import { View, Text } from 'react-native';

const navItems = [
  { label: 'Dashboard', icon: '⚙️', active: true },
  { label: 'My Reports', icon: '⚠️' },
  { label: 'Map View', icon: '📍' },
  { label: 'Profile', icon: '👤' },
  { label: 'Help', icon: '❓' },
];

const SidebarNavigation = () => (
  <View className="bg-white rounded-2xl p-4 mt-6 ml-2 w-48 shadow border border-gray-200">
    {navItems.map((item, idx) => (
      <View
        key={item.label}
        className={`flex-row items-center px-3 py-2 mb-2 rounded-lg ${item.active ? 'bg-blue-50' : ''}`}
      >
        <Text className={`mr-3 text-lg ${item.active ? 'text-blue-600' : 'text-gray-500'}`}>{item.icon}</Text>
        <Text className={`font-medium ${item.active ? 'text-blue-600' : 'text-gray-700'}`}>{item.label}</Text>
      </View>
    ))}
  </View>
);

export default SidebarNavigation; 