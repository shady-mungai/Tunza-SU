import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

// Placeholder components (replace with actual implementations)
const HeaderBar = () => <View style={styles.header}><></></View>;
const SidebarNavigation = () => <View style={styles.sidebar}><></></View>;
const StatCardList = () => <View style={styles.statCardList}><></></View>;
const QuickActions = () => <View style={styles.quickActions}><></></View>;
const RecentReportsList = () => <View style={styles.recentReports}><></></View>;

const StudentDashboard = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(Dimensions.get('window').width >= 768);

  useEffect(() => {
    const onChange = ({ window }) => setIsLargeScreen(window.width >= 768);
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar />
      <View style={styles.contentRow}>
        {isLargeScreen && <SidebarNavigation />}
        <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 24 }}>
          <StatCardList />
          <QuickActions />
          <RecentReportsList />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 220,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  statCardList: {
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 16,
  },
  recentReports: {
    marginBottom: 16,
  },
});

export default StudentDashboard; 