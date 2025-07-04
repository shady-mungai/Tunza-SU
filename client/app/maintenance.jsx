import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
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
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const App = () => {
  // Placeholder data for reports in a maintenance context
  const maintenanceReports = [
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
  ];

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
            <TouchableOpacity style={styles.navItem}>
              <ListTodo size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>All Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <ListChecks size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Assigned Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Users size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <BarChart size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <UserCircle size={20} color="#4B5563" style={styles.navIcon} />
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
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
                  <Text style={styles.userName}>Richard Mungai</Text>
                  <Text style={styles.userId}>MNT/001</Text>
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
                <AlertTriangle size={24} color="#2563EB" />
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
                <Plus size={24} color="#4F46E5" />
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
                <Clock size={24} color="#D97706" />
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
                <Settings size={24} color="#7C3AED" />
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
                <CheckCircle size={24} color="#10B981" />
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
                <Clock size={24} color="#EF4444" />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Eye size={32} color="#2563EB" style={styles.quickActionIcon} />
                <Text style={styles.quickActionText}>View New Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <ListChecks
                  size={32}
                  color="#2563EB"
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionText}>Manage Assignments</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <BarChart
                  size={32}
                  color="#2563EB"
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionText}>Generate Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* All Reports */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Reports</Text>
              <TouchableOpacity>
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
                    <Eye
                      size={20}
                      color="#6B7280"
                      style={styles.reportEyeIcon}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
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
    padding: 32, // Equivalent to p-8
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align to end for user info
    alignItems: "center",
    marginBottom: 32, // Equivalent to mb-8
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
    marginBottom: 32, // Equivalent to mb-8
    // Adjust item width based on screen size for responsive grid
    // For 2 cols on small, 5 on large
  },
  card: {
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 24, // Equivalent to p-6
    borderRadius: 12, // Equivalent to rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: (width - 64 - 32) / 2 - 12, // (screen_width - sidebar_width - main_padding) / 2 - gap
    marginBottom: 24, // Equivalent to gap-6
  },
  cardLabel: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 14, // Equivalent to text-sm
    marginBottom: 4, // Equivalent to mb-1
  },
  cardValue: {
    fontSize: 30, // Equivalent to text-3xl
    fontWeight: "bold",
    color: "#1F2937", // Equivalent to text-gray-800
  },
  cardIconCircle: {
    width: 48, // Equivalent to w-12
    height: 48, // Equivalent to h-12
    borderRadius: 24, // Equivalent to rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 32, // Equivalent to mb-8
  },
  sectionTitle: {
    fontSize: 20, // Equivalent to text-xl
    fontWeight: "600", // Equivalent to font-semibold
    color: "#1F2937", // Equivalent to text-gray-800
    marginBottom: 16, // Equivalent to mb-4
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#FFFFFF", // Equivalent to bg-white
    padding: 24, // Equivalent to p-6
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
    marginBottom: 24, // Equivalent to gap-6
  },
  quickActionIcon: {
    marginBottom: 8, // Equivalent to mb-2
  },
  quickActionText: {
    color: "#4B5563", // Equivalent to text-gray-700
    fontWeight: "500", // Equivalent to font-medium
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, // Equivalent to mb-4
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
    padding: 24, // Equivalent to p-6
    borderRadius: 12, // Equivalent to rounded-xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Default for md:flex-row
    marginBottom: 16, // Equivalent to space-y-4
    flexWrap: "wrap", // Allow wrapping on smaller screens
  },
  reportDetails: {
    flexShrink: 1,
    // For responsive layout, adjust width if needed
  },
  reportTitle: {
    color: "#1F2937", // Equivalent to text-gray-800
    fontWeight: "500", // Equivalent to font-medium
    fontSize: 18, // Equivalent to text-lg
  },
  reportLocation: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 14, // Equivalent to text-sm
    marginTop: 4, // Equivalent to mt-1
  },
  reportDate: {
    color: "#6B7280", // Equivalent to text-gray-500
    fontSize: 14, // Equivalent to text-sm
  },
  reportAssignedTo: {
    color: "#4B5563", // Equivalent to text-gray-600
    fontSize: 14, // Equivalent to text-sm
    fontWeight: "500", // Equivalent to font-medium
    marginTop: 4, // Equivalent to mt-1
  },
  reportBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Equivalent to space-x-3
    marginTop: 12, // Equivalent to mt-3 md:mt-0
    flexWrap: "wrap", // Allow badges to wrap
    justifyContent: "flex-end", // Align badges to the right on small screens
    flexShrink: 0,
  },
  badge: {
    paddingHorizontal: 12, // Equivalent to px-3
    paddingVertical: 4, // Equivalent to py-1
    borderRadius: 9999, // Equivalent to rounded-full
    fontSize: 12, // Equivalent to text-xs
    fontWeight: "600", // Equivalent to font-semibold
    // Background and color are set inline based on status/priority
  },
  reportEyeIcon: {
    // Styles for eye icon
  },
});

export default App;
