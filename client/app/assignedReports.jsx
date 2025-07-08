import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  LayoutDashboard,
  ListTodo,
  ListChecks,
  Users,
  BarChart,
  UserCircle,
  HelpCircle,
  Eye,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContexts";
import LayoutWrapper from "../src/components/LayoutWrapper";
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get("window");

const AssignedReports = () => {
  const navigation = useNavigation();
  const { user, sendMail } = useAuth();
  const [assignedReports, setAssignedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch assigned reports from database
  useEffect(() => {
    const fetchAssignedReports = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/assignedReports?maintenance_id=${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned reports");
        }

        const data = await response.json();
        setAssignedReports(data.reports || []);
      } catch (err) {
        console.error("Error fetching assigned reports:", err);
        setError("Failed to load assigned reports. Please try again.");
        setAssignedReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedReports();
  }, [user?.id]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status) {
        case "New":
          return { backgroundColor: "#E0E7FF", color: "#4F46E5" };
        case "In Progress":
          return { backgroundColor: "#DBEAFE", color: "#2563EB" };
        case "Pending Review":
          return { backgroundColor: "#FEF3C7", color: "#D97706" };
        case "completed":
          return { backgroundColor: "#D1FAE5", color: "#10B981" };
        case "Overdue":
          return { backgroundColor: "#FEE2E2", color: "#EF4444" };
        default:
          return { backgroundColor: "#E5E7EB", color: "#4B5563" };
      }
    };

    return <Text style={[styles.badge, getStatusStyle()]}>{status}</Text>;
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const getPriorityStyle = () => {
      switch (priority) {
        case "High":
          return { backgroundColor: "#FEE2E2", color: "#EF4444" };
        case "Medium":
          return { backgroundColor: "#FFF7ED", color: "#F97316" };
        case "Low":
          return { backgroundColor: "#E5E7EB", color: "#4B5563" };
        default:
          return { backgroundColor: "#E5E7EB", color: "#4B5563" };
      }
    };

    return <Text style={[styles.badge, getPriorityStyle()]}>{priority}</Text>;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  // Handle report view (open status picker modal)
  const handleViewReport = (reportId) => {
    const report = assignedReports.find(r => r.id === reportId);
    setSelectedReport(report);
    setSelectedStatus(report.status);
    setStatusModalVisible(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedReport || !selectedStatus) return;

    console.log('-----------------SELECTED REPORT----------------------------')

    console.log(selectedReport);
    
    console.log('---------------------------------------------')

    try {
      const response = await fetch(`http://localhost:4000/reports/${selectedReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      // Update local state
      setAssignedReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, status: selectedStatus } : r));
      setStatusModalVisible(false);
      setSelectedReport(null);
      // Notify student if resolved
      if (selectedStatus === 'completed' && selectedReport.reporter_email && selectedReport.reporter_name) {
        sendMail({
          to_email: selectedReport.reporter_email,
          to_name: selectedReport.reporter_name,
          status: selectedReport.status,
          location: selectedReport.location,
          category: selectedReport.category
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update report status.');
    }
  };

  return (
    <LayoutWrapper>
      <ScrollView style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Reports</Text>
          <Text style={styles.sectionSubtitle}>
            Reports assigned to {user?.name || "you"}
          </Text>
        </View>

        <View style={styles.reportsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>
                Loading assigned reports...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  // Trigger refetch by updating user.id dependency
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : assignedReports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No assigned reports found.</Text>
              <Text style={styles.emptySubtext}>
                Reports assigned to you will appear here.
              </Text>
            </View>
          ) : (
            assignedReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportItem}
                onPress={() => handleViewReport(report.id)}
                activeOpacity={0.7}
              >
                <View style={styles.reportDetails}>
                  <Text style={styles.reportTitle}>
                    {report.title || "Untitled Report"}
                  </Text>
                  <Text style={styles.reportLocation}>
                    {report.location || "Location not specified"}
                  </Text>
                  <Text style={styles.reportDate}>
                    {formatDate(report.created_at)}
                  </Text>
                  <Text style={styles.reportDescription}>
                    {report.description || "No description available"}
                  </Text>
                  <Text style={styles.reporterInfo}>
                    Reported by: {report.reporter_name || "Unknown"}
                    {report.reporter_email && ` (${report.reporter_email})`}
                  </Text>
                </View>
                <View style={styles.reportBadges}>
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority} />
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewReport(report.id)}
                  >
                    <Eye size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      {/* Status Update Modal with Native Picker */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: '#1F2937', textAlign: 'center' }}>Update Status</Text>
            <View style={{ backgroundColor: '#F3F4F6', borderRadius: 16, overflow: 'hidden', marginBottom: 28, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                style={{ height: 48, borderRadius: 16, color: '#1F2937', backgroundColor: 'transparent' }}
                itemStyle={{ fontSize: 16, color: '#1F2937', fontWeight: '500' }}
                dropdownIconColor="##228C22"
              >
                <Picker.Item label="Pending Review" value="under_review" />
                <Picker.Item label="In Progress" value="in_progress" />
                <Picker.Item label="Resolved" value="completed" />
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#F3F4F6', marginRight: 8 }}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStatusUpdate} style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#228C22' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    padding: 32,
    backgroundColor: "#F3F4F6",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  sectionSubtitle: {
    color: "#6B7280",
    fontSize: 14,
  },
  reportsList: {},
  reportItem: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  reportDetails: {
    flexShrink: 1,
  },
  reportTitle: {
    color: "#1F2937",
    fontWeight: "500",
    fontSize: 18,
  },
  reportLocation: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  reportDate: {
    color: "#6B7280",
    fontSize: 14,
  },
  reportDescription: {
    color: "#6B7280",
    fontSize: 14,
  },
  reporterInfo: {
    color: "#4B5563",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  reportBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    padding: 8,
    borderRadius: 9999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 9999,
    backgroundColor: "#2563EB",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 16,
  },
  emptySubtext: {
    color: "#6B7280",
    fontSize: 14,
  },
});

export default AssignedReports;
