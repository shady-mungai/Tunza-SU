import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import HeaderBar from './HeaderBar';
import StatCardList from './StatCardList';
import QuickActions from './QuickActions';
import RecentReportsList from './RecentReportsList';
import SidebarNavigation from './SidebarNavigation';
import ReportForm from './ReportForm';
import { useAuth } from '../contexts/AuthContexts';

const StudentDashboard = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(Dimensions.get('window').width >= 768);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onChange = ({ window }) => setIsLargeScreen(window.width >= 768);
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  const handleOpenReportModal = () => setReportModalVisible(true);
  const handleCloseReportModal = () => setReportModalVisible(false);

  const handleSubmitReport = async (reportData, isFormData = false) => {
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:4000/addReport', {
        method: 'POST',
        ...(isFormData
          ? { body: reportData }
          : {
              headers: { 'Content-Type': 'multipart/form-data' },
              body: JSON.stringify({ ...reportData, user_id: user?.id }),
            }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Report submitted successfully!');
      } else {
        Alert.alert('Error', 'Failed to submit report.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar />
      <View style={styles.contentRow}>
        {isLargeScreen && <SidebarNavigation />}
        <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 24 }}>
          <StatCardList />
          <QuickActions onNewReport={handleOpenReportModal} />
          <RecentReportsList />
        </ScrollView>
      </View>
      <ReportForm
        visible={reportModalVisible}
        onClose={handleCloseReportModal}
        onSubmit={handleSubmitReport}
        submitting={submitting}
      />
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