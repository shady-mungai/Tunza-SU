import React from 'react';
import { View, Text } from 'react-native';

const stats = [
  { label: 'Total Reports', value: 2, icon: '⚠️', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Pending', value: 1, icon: '⏰', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: 'In Progress', value: 1, icon: '⚙️', color: 'text-blue-400', bg: 'bg-blue-50' },
  { label: 'Resolved', value: 0, icon: '✅', color: 'text-green-500', bg: 'bg-green-50' },
];

const StatCard = ({ label, value, icon, color, bg, isLast }) => (
  <View
    className={`flex-row items-center p-4 rounded-xl border border-gray-200 ${bg}`}
    style={{
      flex: 1,
      minWidth: 150,
      marginRight: isLast ? 0 : 12,
      marginBottom: 12,
      maxWidth: '100%',
    }}
  >
    <View className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${bg}`}>
      <Text className={`text-2xl ${color}`}>{icon}</Text>
    </View>
    <View style={{ flexShrink: 1 }}>
      <Text className="text-xs text-gray-500 font-medium mb-1" numberOfLines={1} ellipsizeMode="tail">{label}</Text>
      <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
    </View>
  </View>
);

const StatCardList = () => (
  <View
    className="mb-6 mt-6"
    style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
  >
    {stats.map((stat, idx) => (
      <StatCard key={stat.label} {...stat} isLast={idx === stats.length - 1} />
    ))}
  </View>
);

export default StatCardList; 