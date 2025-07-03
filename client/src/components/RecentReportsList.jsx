import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const reports = [
  {
    title: 'Broken Window in Library',
    location: 'Main Library, 2nd Floor',
    date: 'Jan 15, 2024',
    status: 'In Progress',
    priority: 'High',
  },
  {
    title: 'Leaking Faucet in Dormitory',
    location: 'Dormitory Block A, Room 205',
    date: 'Jan 14, 2024',
    status: 'Pending Review',
    priority: 'Medium',
  },
];

const statusBadge = (status) => {
  if (status === 'In Progress') return <Text className="bg-blue-50 text-blue-500 px-2 py-1 rounded-full text-xs font-semibold mr-2">In Progress</Text>;
  if (status === 'Pending Review') return <Text className="bg-yellow-50 text-yellow-500 px-2 py-1 rounded-full text-xs font-semibold mr-2">Pending Review</Text>;
  return null;
};

const priorityBadge = (priority) => {
  if (priority === 'High') return <Text className="bg-orange-50 text-orange-500 px-2 py-1 rounded-full text-xs font-semibold mr-2">High</Text>;
  if (priority === 'Medium') return <Text className="bg-yellow-50 text-yellow-500 px-2 py-1 rounded-full text-xs font-semibold mr-2">Medium</Text>;
  return null;
};

const RecentReportsList = () => (
  <View className="bg-white rounded-2xl p-6 border border-gray-200">
    <View className="flex-row justify-between items-center mb-4">
      <Text className="font-bold text-lg text-gray-900">Recent Reports</Text>
      <TouchableOpacity onPress={() => navigation.navigate( { screen: 'MyReports' })}>
        <Text className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm">View All</Text>
      </TouchableOpacity>
    </View>
    <View>
      {reports.map((report, idx) => (
        <View key={report.title} className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between">
          <View>
            <Text className="font-semibold text-gray-900 mb-1">{report.title}</Text>
            <Text className="text-xs text-gray-500 mb-1">{report.location}</Text>
            <Text className="text-xs text-gray-400">{report.date}</Text>
          </View>
          <View className="flex-row items-center">
            {statusBadge(report.status)}
            {priorityBadge(report.priority)}
            <Text className="ml-2 text-gray-400 text-lg">👁️</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default RecentReportsList; 