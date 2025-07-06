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

const { width } = Dimensions.get("window");

const AssignedReports = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [assignedReports, setAssignedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(`http://localhost:4000/assignedReports?maintenance_id=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assigned reports');
        }

        const data = await response.json();
        setAssignedReports(data.reports || []);
      } catch (err) {
        console.error('Error fetching assigned reports:', err);
        setError('Failed to load assigned reports. Please try again.');
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
        case "Resolved":
          return { backgroundColor: "#D1FAE5", color: "#10B981" };
        case "Overdue":
          return { backgroundColor: "#FEE2E2", color: "#EF4444" };
        default:
          return { backgroundColor: "#E5E7EB", color: "#4B5563" };
      }
    };

    return (
      <Text style={[styles.badge, getStatusStyle()]}>
        {status}
      </Text>
    );
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

    return (
      <Text style={[styles.badge, getPriorityStyle()]}>
        {priority}
      </Text>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Handle report view
  const handleViewReport = (reportId) => {
    // TODO: Navigate to report details page
    console.log('Viewing report:', reportId);
    Alert.alert('View Report', `Viewing report ${reportId}`);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.appTitle}>TunzaSU</Text>
        </View>
        <Text style={styles.dashboardSubtitle}>Maintenance Dashboard</Text>
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("dashboard")}
          >
            <LayoutDashboard size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("all_reports")}
          >
            <ListTodo size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>All Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <ListChecks size={20} color="#2563EB" style={styles.navIcon} />
            <Text style={[styles.navText, styles.activeNavText]}>
              Assigned Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("analytics")}
          >
            <BarChart size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("profile")}
          >
            <UserCircle size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("help")}
          >
            <HelpCircle size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Reports</Text>
          <Text style={styles.sectionSubtitle}>
            Reports assigned to {user?.name || 'you'}
          </Text>
        </View>

        <View style={styles.reportsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Loading assigned reports...</Text>
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
                  <Text style={styles.reportTitle}>{report.title || 'Untitled Report'}</Text>
                  <Text style={styles.reportLocation}>{report.location || 'Location not specified'}</Text>
                  <Text style={styles.reportDate}>
                    {formatDate(report.created_at)}
                  </Text>
                  <Text style={styles.reportDescription}>
                    {report.description || 'No description available'}
                  </Text>
                  <Text style={styles.reporterInfo}>
                    Reported by: {report.reporter_name || 'Unknown'} 
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 256,
    backgroundColor: "#FFFFFF",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#2563EB",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  appTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  dashboardSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 24,
  },
  navContainer: {
    flexGrow: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeNavItem: {
    backgroundColor: "#DBEAFE",
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  activeNavText: {
    color: "#2563EB",
  },
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
