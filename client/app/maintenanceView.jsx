import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import {
  useNavigation,
  useNavigationContainerRef,
} from "@react-navigation/native";
// You might need to install lucide-react-native: `npx expo install lucide-react-native`
import {
  Bell,
  User,
  LayoutDashboard,
  ListTodo,
  MapPin,
  UserCircle,
  HelpCircle,
  AlertTriangle,
  Clock,
  Settings,
  CheckCircle,
  Plus,
  Eye,
  ListChecks,
  Users,
  BarChart,
  X,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContexts";

const { width } = Dimensions.get("window");

const Dashboard = ({ navigation: propNavigation, route }) => {
  const navigation = useNavigation();
  const navigationRef = useNavigationContainerRef();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [maintenanceReports, setMaintenanceReports] = useState([
    {
      id: 1,
      title: "Broken Window in Library",
      location: "Main Library, 2nd Floor",
      date: "Jan 16, 2024",
      status: "In Progress",
      priority: "High",
      assignedTo: "Engineer A",
    },
    {
      id: 2,
      title: "Leaking Faucet in Dormitory",
      location: "Dormitory Block A, Room 205",
      date: "Jan 14, 2024",
      status: "Pending Review",
      priority: "Medium",
      assignedTo: "Unassigned",
    },
    {
      id: 3,
      title: "Lights Flickering in Lecture Hall",
      location: "Science Building, Lecture Hall 3",
      date: "Jan 12, 2024",
      status: "Resolved",
      priority: "Low",
      assignedTo: "Electrician B",
    },
    {
      id: 4,
      title: "Damaged Chair in Classroom",
      location: "Block C, Room 101",
      date: "Jan 10, 2024",
      status: "New",
      priority: "Low",
      assignedTo: "Unassigned",
    },
    {
      id: 5,
      title: "Clogged Toilet in Washroom",
      location: "Administration Building, Ground Floor",
      date: "Jan 08, 2024",
      status: "Overdue",
      priority: "High",
      assignedTo: "Plumber C",
    },
  ]);

  // Use prop navigation if available, otherwise use hook

  // Debug navigation context
  console.log("Dashboard navigation context:", {
    hasNavigation: !!navigation,
    hasPropNavigation: !!propNavigation,
    navigationType: navigation?.constructor?.name,
    availableRoutes: navigation?.getState()?.routes?.map((r) => r.name),
    routeName: route?.name,
    navigationState: navigation?.getState(),
    parentNavigation: navigation?.getParent?.(),
  });

  // Function to handle opening report modal
  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  // Function to close report modal
  const handleCloseReport = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  // Function to open status update modal
  const handleUpdateStatus = () => {
    setStatusModalVisible(true);
  };

  // Function to close status update modal
  const handleCloseStatusModal = () => {
    setStatusModalVisible(false);
  };

  // Function to update report status
  const handleStatusChange = (newStatus) => {
    if (selectedReport) {
      const updatedReports = maintenanceReports.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: newStatus }
          : report
      );
      setMaintenanceReports(updatedReports);

      // Update the selected report in the modal
      const updatedSelectedReport = updatedReports.find(
        (report) => report.id === selectedReport.id
      );
      setSelectedReport(updatedSelectedReport);

      setStatusModalVisible(false);
    }
  };

  // Function to handle Help navigation
  const handleHelpNavigation = () => {
    console.log("Help button pressed");

    // Try multiple navigation approaches
    const navigationAttempts = [
      () => {
        console.log("Attempt 1: Direct navigation");
        return navigation.navigate("Help");
      },
      () => {
        console.log("Attempt 2: Prop navigation");
        return propNavigation?.navigate("Help");
      },
      () => {
        console.log("Attempt 3: Parent navigation");
        const parent = navigation?.getParent?.();
        return parent?.navigate("Help");
      },
      () => {
        console.log("Attempt 4: Push navigation");
        return navigation.push("Help");
      },
      () => {
        console.log("Attempt 5: Reset to Help");
        return navigation.reset({
          index: 0,
          routes: [{ name: "Help" }],
        });
      },
    ];

    for (let i = 0; i < navigationAttempts.length; i++) {
      try {
        console.log(`Trying navigation attempt ${i + 1}`);
        navigationAttempts[i]();
        console.log(`Navigation attempt ${i + 1} succeeded`);
        return; // Exit if successful
      } catch (error) {
        console.error(`Navigation attempt ${i + 1} failed:`, error);
        if (i === navigationAttempts.length - 1) {
          // All attempts failed
          console.error("All navigation attempts failed");
          alert("Navigation failed. Please try again.");
        }
      }
    }
  };

  // Calculate dashboard statistics based on maintenanceReports data
  const totalReports = maintenanceReports.length;
  const newReports = maintenanceReports.filter(
    (report) => report.status === "New"
  ).length;
  const pendingReports = maintenanceReports.filter(
    (report) => report.status === "Pending Review"
  ).length;
  const inProgressReports = maintenanceReports.filter(
    (report) => report.status === "In Progress"
  ).length;
  const resolvedReports = maintenanceReports.filter(
    (report) => report.status === "Resolved"
  ).length;
  const overdueReports = maintenanceReports.filter(
    (report) => report.status === "Overdue"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar - typically a Drawer Navigator in React Native, simplified here */}
        {/* For a full sidebar, you'd use a library like @react-navigation/drawer */}
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <Text style={styles.appTitle}>TunzaSU</Text>
          </View>
          <Text style={styles.dashboardSubtitle}>Maintenance Dashboard</Text>

          <View style={styles.navContainer}>
            <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
              <LayoutDashboard
                size={20}
                color="#2563EB"
                style={styles.navIcon}
              />
              <Text style={[styles.navText, styles.activeNavText]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate("AllReports")}
            >
              <ListTodo size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>All Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate("AssignedReports")}
            >
              <ListChecks size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Assigned Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate("Analytics")}
            >
              <BarChart size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                console.log("Profile button pressed");
                navigation.navigate("Profile");
              }}
              activeOpacity={0.7}
              delayPressIn={0}
            >
              <UserCircle size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => {
                console.log("help button pressed");
                navigation.navigate("Help");
              }}
              activeOpacity={0.7}
              delayPressIn={0}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HelpCircle size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <View /> {/* Empty view to align other items to right */}
            <View style={styles.headerRight}>
              <Bell size={24} color="#4B5563" style={styles.headerIcon} />
              <View style={styles.userInfo}>
                <User size={32} color="#4B5563" style={styles.userAvatar} />
                <View>
                  <Text style={styles.userName}>{user?.name || "User"}</Text>
                  <Text style={styles.userId}>
                    {user?.admission_number || user?.employeeId || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Dashboard Overview Cards */}
          <View style={styles.cardsGrid}>
            {/* Total Reports Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>Total Reports</Text>
                <Text style={styles.cardValue}>{totalReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#DBEAFE" }]}
              >
                <AlertTriangle size={20} color="#2563EB" />
              </View>
            </View>

            {/* New Reports Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>New Reports</Text>
                <Text style={styles.cardValue}>{newReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#E0E7FF" }]}
              >
                <Plus size={20} color="#4F46E5" />
              </View>
            </View>

            {/* Pending Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>Pending Review</Text>
                <Text style={styles.cardValue}>{pendingReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#FEF3C7" }]}
              >
                <Clock size={20} color="#D97706" />
              </View>
            </View>

            {/* In Progress Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>In Progress</Text>
                <Text style={styles.cardValue}>{inProgressReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#EDE9FE" }]}
              >
                <Settings size={20} color="#7C3AED" />
              </View>
            </View>

            {/* Resolved Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>Resolved</Text>
                <Text style={styles.cardValue}>{resolvedReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#D1FAE5" }]}
              >
                <CheckCircle size={20} color="#10B981" />
              </View>
            </View>

            {/* Overdue Reports Card */}
            <View style={styles.card}>
              <View>
                <Text style={styles.cardLabel}>Overdue Reports</Text>
                <Text style={styles.cardValue}>{overdueReports}</Text>
              </View>
              <View
                style={[styles.cardIconCircle, { backgroundColor: "#FEE2E2" }]}
              >
                <Clock size={20} color="#EF4444" />
              </View>
            </View>
          </View>

          {/* Quick Actions and Recent Reports in a row */}
          <View style={styles.horizontalSection}>
            {/* Quick Actions */}
            <View style={styles.halfSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Eye
                    size={24}
                    color="#2563EB"
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionText}>View New Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <ListChecks
                    size={24}
                    color="#2563EB"
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionText}>Manage Assignments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <BarChart
                    size={24}
                    color="#2563EB"
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionText}>Generate Reports</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Reports */}
            <View style={styles.halfSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Reports</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AllReports")}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.reportsList}>
                {maintenanceReports.slice(0, 3).map((report) => (
                  <View key={report.id} style={styles.reportItem}>
                    <View style={styles.reportDetails}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <Text style={styles.reportLocation}>
                        {report.location}
                      </Text>
                      <Text style={styles.reportDate}>{report.date}</Text>
                    </View>
                    <View style={styles.reportBadges}>
                      {report.status === "New" && (
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: "#E0E7FF", color: "#4F46E5" },
                          ]}
                        >
                          New
                        </Text>
                      )}
                      {report.status === "In Progress" && (
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: "#DBEAFE", color: "#2563EB" },
                          ]}
                        >
                          In Progress
                        </Text>
                      )}
                      {report.status === "Pending Review" && (
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: "#FEF3C7", color: "#D97706" },
                          ]}
                        >
                          Pending Review
                        </Text>
                      )}
                      {report.status === "Resolved" && (
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: "#D1FAE5", color: "#10B981" },
                          ]}
                        >
                          Resolved
                        </Text>
                      )}
                      {report.status === "Overdue" && (
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: "#FEE2E2", color: "#EF4444" },
                          ]}
                        >
                          Overdue
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={() => handleOpenReport(report)}
                        style={styles.eyeButton}
                      >
                        <Eye
                          size={20}
                          color="#6B7280"
                          style={styles.reportEyeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* All Reports */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Reports</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllReports")}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reportsList}>
              {maintenanceReports.map((report) => (
                <View key={report.id} style={styles.reportItem}>
                  <View style={styles.reportDetails}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportLocation}>{report.location}</Text>
                    <Text style={styles.reportDate}>{report.date}</Text>
                    <Text style={styles.reportAssignedTo}>
                      Assigned To:{" "}
                      <Text style={{ fontWeight: "normal" }}>
                        {report.assignedTo}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.reportBadges}>
                    {report.status === "New" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#E0E7FF", color: "#4F46E5" },
                        ]}
                      >
                        New
                      </Text>
                    )}
                    {report.status === "In Progress" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#DBEAFE", color: "#2563EB" },
                        ]}
                      >
                        In Progress
                      </Text>
                    )}
                    {report.status === "Pending Review" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#FEF3C7", color: "#D97706" },
                        ]}
                      >
                        Pending Review
                      </Text>
                    )}
                    {report.status === "Resolved" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#D1FAE5", color: "#10B981" },
                        ]}
                      >
                        Resolved
                      </Text>
                    )}
                    {report.status === "Overdue" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#FEE2E2", color: "#EF4444" },
                        ]}
                      >
                        Overdue
                      </Text>
                    )}

                    {report.priority === "High" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#FEE2E2", color: "#EF4444" },
                        ]}
                      >
                        High
                      </Text>
                    )}
                    {report.priority === "Medium" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#FFF7ED", color: "#F97316" },
                        ]}
                      >
                        Medium
                      </Text>
                    )}
                    {report.priority === "Low" && (
                      <Text
                        style={[
                          styles.badge,
                          { backgroundColor: "#E5E7EB", color: "#4B5563" },
                        ]}
                      >
                        Low
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => handleOpenReport(report)}
                      style={styles.eyeButton}
                    >
                      <Eye
                        size={20}
                        color="#6B7280"
                        style={styles.reportEyeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Report Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseReport}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Details</Text>
              <TouchableOpacity
                onPress={handleCloseReport}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedReport && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.reportDetailSection}>
                  <Text style={styles.reportDetailTitle}>
                    {selectedReport.title}
                  </Text>
                  <Text style={styles.reportDetailLocation}>
                    <MapPin
                      size={16}
                      color="#6B7280"
                      style={styles.detailIcon}
                    />
                    {selectedReport.location}
                  </Text>
                  <Text style={styles.reportDetailDate}>
                    <Clock
                      size={16}
                      color="#6B7280"
                      style={styles.detailIcon}
                    />
                    {selectedReport.date}
                  </Text>
                  <Text style={styles.reportDetailAssigned}>
                    <User size={16} color="#6B7280" style={styles.detailIcon} />
                    Assigned To: {selectedReport.assignedTo}
                  </Text>
                </View>

                <View style={styles.reportDetailBadges}>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeLabel}>Status:</Text>
                    {selectedReport.status === "New" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#E0E7FF", color: "#4F46E5" },
                        ]}
                      >
                        New
                      </Text>
                    )}
                    {selectedReport.status === "In Progress" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#DBEAFE", color: "#2563EB" },
                        ]}
                      >
                        In Progress
                      </Text>
                    )}
                    {selectedReport.status === "Pending Review" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#FEF3C7", color: "#D97706" },
                        ]}
                      >
                        Pending Review
                      </Text>
                    )}
                    {selectedReport.status === "Resolved" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#D1FAE5", color: "#10B981" },
                        ]}
                      >
                        Resolved
                      </Text>
                    )}
                    {selectedReport.status === "Overdue" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#FEE2E2", color: "#EF4444" },
                        ]}
                      >
                        Overdue
                      </Text>
                    )}
                  </View>

                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeLabel}>Priority:</Text>
                    {selectedReport.priority === "High" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#FEE2E2", color: "#EF4444" },
                        ]}
                      >
                        High
                      </Text>
                    )}
                    {selectedReport.priority === "Medium" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#FFF7ED", color: "#F97316" },
                        ]}
                      >
                        Medium
                      </Text>
                    )}
                    {selectedReport.priority === "Low" && (
                      <Text
                        style={[
                          styles.detailBadge,
                          { backgroundColor: "#E5E7EB", color: "#4B5563" },
                        ]}
                      >
                        Low
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.reportDetailActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleUpdateStatus}
                  >
                    <Text style={styles.actionButtonText}>Update Status</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Assign to Me</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={handleCloseStatusModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Status</Text>
              <TouchableOpacity
                onPress={handleCloseStatusModal}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.statusUpdateText}>
                Select a new status for this report:
              </Text>

              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusChange("In Progress")}
                >
                  <Text style={styles.statusOptionText}>In Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusChange("Pending Review")}
                >
                  <Text style={styles.statusOptionText}>Pending Review</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusChange("Resolved")}
                >
                  <Text style={styles.statusOptionText}>Resolved</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Equivalent to bg-gray-100
  },
  container: {
    flex: 1,
    flexDirection: "row", // For sidebar and main content
  },
  sidebar: {
    width: 256, // Equivalent to w-64
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 24, // Equivalent to p-6
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
    borderTopRightRadius: 12, // Equivalent to rounded-r-xl
    borderBottomRightRadius: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40, // Equivalent to mb-10
  },
  logoCircle: {
    width: 40, // Equivalent to w-10
    height: 40, // Equivalent to h-10
    backgroundColor: "#2563EB", // Equivalent to bg-blue-600
    borderRadius: 20, // Equivalent to rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF", // Equivalent to text-white
    fontSize: 20, // Equivalent to text-xl
    fontWeight: "bold",
  },
  appTitle: {
    marginLeft: 12, // Equivalent to ml-3
    fontSize: 20, // Equivalent to text-xl
    fontWeight: "600", // Equivalent to font-semibold
    color: "#1F2937", // Equivalent to text-gray-800
  },
  dashboardSubtitle: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 14, // Equivalent to text-sm
    marginBottom: 24, // Equivalent to mb-6
  },
  navContainer: {
    flexGrow: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12, // Equivalent to p-3
    borderRadius: 12, // Equivalent to rounded-xl
    marginBottom: 12, // Equivalent to mb-3
  },
  activeNavItem: {
    backgroundColor: "#DBEAFE", // Equivalent to bg-blue-100
  },
  navIcon: {
    marginRight: 12, // Equivalent to mr-3
  },
  navText: {
    color: "#4B5563", // Equivalent to text-gray-600
    fontWeight: "500", // Equivalent to font-medium
  },
  activeNavText: {
    color: "#2563EB", // Equivalent to text-blue-700
  },
  mainContent: {
    flex: 1,
    padding: 24, // Reduced from 32
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align to end for user info
    alignItems: "center",
    marginBottom: 24, // Reduced from 32
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24, // Equivalent to space-x-6
  },
  headerIcon: {
    // Styles for bell icon
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Equivalent to space-x-2
  },
  userAvatar: {
    borderRadius: 16, // Equivalent to rounded-full
    backgroundColor: "#E5E7EB", // Equivalent to bg-gray-200
    padding: 4, // Equivalent to p-1
  },
  userName: {
    color: "#1F2937", // Equivalent to text-gray-800
    fontWeight: "500", // Equivalent to font-medium
  },
  userId: {
    fontSize: 12, // Equivalent to text-sm
    color: "#6B7280", // Equivalent to text-gray-500
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24, // Reduced from 32
    // Adjust item width based on screen size for responsive grid
    // For 3 cols on small, 6 on large
  },
  card: {
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 16, // Reduced from 24
    borderRadius: 12, // Equivalent to rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: (width - 64 - 32) / 3 - 8, // (screen_width - sidebar_width - main_padding) / 3 - gap
    marginBottom: 16, // Reduced from 24
  },
  cardLabel: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 14, // Equivalent to text-sm
    marginBottom: 4, // Equivalent to mb-1
  },
  cardValue: {
    fontSize: 24, // Reduced from 30
    fontWeight: "bold",
    color: "#1F2937", // Equivalent to text-gray-800
  },
  cardIconCircle: {
    width: 40, // Reduced from 48
    height: 40, // Reduced from 48
    borderRadius: 20, // Reduced from 24
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 24, // Reduced from 32
  },
  sectionTitle: {
    fontSize: 18, // Reduced from 20
    fontWeight: "600", // Equivalent to font-semibold
    color: "#1F2937", // Equivalent to text-gray-800
    marginBottom: 12, // Reduced from 16
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 16, // Reduced from 24
    borderRadius: 12, // Equivalent to rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: (width - 64 - 32) / 3 - 16, // (screen_width - sidebar_width - main_padding) / 3 - gap
    marginBottom: 16, // Reduced from 24
  },
  quickActionIcon: {
    marginBottom: 6, // Reduced from 8
  },
  quickActionText: {
    color: "#4B5563", // Equivalent to text-gray-700
    fontWeight: "500", // Equivalent to font-medium
    fontSize: 12, // Added smaller font size
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12, // Reduced from 16
  },
  viewAllText: {
    color: "#2563EB", // Equivalent to text-blue-600
    fontWeight: "500", // Equivalent to font-medium
  },
  reportsList: {
    // space-y-4 translates to marginBottom on each item
  },
  reportItem: {
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 16, // Reduced from 24
    borderRadius: 12, // Equivalent to rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Default for md:flex-row
    marginBottom: 12, // Reduced from 16
    flexWrap: "wrap", // Allow wrapping on smaller screens
  },
  reportDetails: {
    flexShrink: 1,
    // For responsive layout, adjust width if needed
  },
  reportTitle: {
    color: "#1F2937", // Equivalent to text-gray-800
    fontWeight: "500", // Equivalent to font-medium
    fontSize: 16, // Reduced from 18
  },
  reportLocation: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 12, // Reduced from 14
    marginTop: 2, // Reduced from 4
  },
  reportDate: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 12, // Reduced from 14
  },
  reportAssignedTo: {
    color: "#4B5563", // Equivalent to text-gray-600
    fontSize: 12, // Reduced from 14
    fontWeight: "500", // Equivalent to font-medium
    marginTop: 2, // Reduced from 4
  },
  reportBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Reduced from 12
    marginTop: 8, // Reduced from 12
    flexWrap: "wrap", // Allow badges to wrap
    justifyContent: "flex-end", // Align badges to the right on small screens
    flexShrink: 0,
  },
  badge: {
    paddingHorizontal: 8, // Reduced from 12
    paddingVertical: 2, // Reduced from 4
    borderRadius: 9999, // Equivalent to rounded-full
    fontSize: 10, // Reduced from 12
    fontWeight: "600", // Equivalent to font-semibold
    // Background and color are set inline based on status/priority
  },
  reportEyeIcon: {
    // Styles for eye icon
  },
  horizontalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Changed from center to flex-start
    marginBottom: 24, // Reduced from 32
    gap: 16, // Added gap between sections
  },
  halfSection: {
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 0,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  reportDetailSection: {
    marginBottom: 24,
  },
  reportDetailTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  reportDetailLocation: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  reportDetailDate: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  reportDetailAssigned: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    marginRight: 8,
  },
  reportDetailBadges: {
    marginBottom: 24,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginRight: 12,
    minWidth: 60,
  },
  detailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: "600",
  },
  reportDetailActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 4,
  },
  // Status Update Modal Styles
  statusUpdateText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  statusOptions: {
    gap: 12,
  },
  statusOption: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
});

export default Dashboard;
