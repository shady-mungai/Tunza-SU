import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  User,
  LayoutDashboard,
  ListTodo,
  ListChecks,
  Users,
  BarChart,
  UserCircle,
  HelpCircle,
  Eye,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

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

const AllReports = () => {
  const navigation = useNavigation();
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
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <ListTodo size={20} color="#2563EB" style={styles.navIcon} />
            <Text style={[styles.navText, styles.activeNavText]}>
              All Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("assigned_reports")}
          >
            <ListChecks size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Assigned Reports</Text>
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
              onPress={() => {
                console.log("Profile button pressed");
                navigation.navigate("profile");
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
                navigation.navigate("help");
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Reports</Text>
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
                <Eye size={20} color="#6B7280" style={styles.reportEyeIcon} />
              </View>
            </View>
          ))}
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
  reportAssignedTo: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
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
  reportEyeIcon: {},
});

export default AllReports;
