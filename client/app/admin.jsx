import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import {
  useNavigation,
  useNavigationContainerRef,
} from "@react-navigation/native";
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
  Shield,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  LogOut,
  Moon,
  Sun,
  BellRing,
  UserCheck,
  UserX,
  FileText,
  PieChart,
  Target,
  Award,
  Zap,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContexts";

const { width, height } = Dimensions.get("window");

const AdminDashboard = ({ navigation: propNavigation, route }) => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for admin dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 1247,
    activeReports: 89,
    resolvedReports: 156,
    pendingReports: 23,
    totalRevenue: 45000,
    monthlyGrowth: 12.5,
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@university.edu",
      role: "Student",
      status: "Active",
      lastActive: "2 hours ago",
      reportsSubmitted: 3,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      role: "Faculty",
      status: "Active",
      lastActive: "1 day ago",
      reportsSubmitted: 7,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      role: "Student",
      status: "Suspended",
      lastActive: "1 week ago",
      reportsSubmitted: 1,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@university.edu",
      role: "Staff",
      status: "Active",
      lastActive: "3 hours ago",
      reportsSubmitted: 12,
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@university.edu",
      role: "Student",
      status: "Inactive",
      lastActive: "2 weeks ago",
      reportsSubmitted: 0,
    },
  ]);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Broken Window in Library",
      location: "Main Library, 2nd Floor",
      date: "Jan 16, 2024",
      status: "In Progress",
      priority: "High",
      assignedTo: "Engineer A",
      submittedBy: "John Doe",
      category: "Infrastructure",
    },
    {
      id: 2,
      title: "Leaking Faucet in Dormitory",
      location: "Dormitory Block A, Room 205",
      date: "Jan 14, 2024",
      status: "Pending Review",
      priority: "Medium",
      assignedTo: "Unassigned",
      submittedBy: "Jane Smith",
      category: "Plumbing",
    },
    {
      id: 3,
      title: "Lights Flickering in Lecture Hall",
      location: "Science Building, Lecture Hall 3",
      date: "Jan 12, 2024",
      status: "Resolved",
      priority: "Low",
      assignedTo: "Electrician B",
      submittedBy: "Mike Johnson",
      category: "Electrical",
    },
  ]);

  // Dark mode colors
  const colors = {
    dark: {
      background: "#0f0f23",
      surface: "#1a1a2e",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      text: "#ffffff",
      textSecondary: "#a1a1aa",
      border: "#2d2d3a",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      card: "#1e1e2e",
    },
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      card: "#ffffff",
    },
  };

  const currentColors = colors[isDarkMode ? "dark" : "light"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    header: {
      backgroundColor: currentColors.surface,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: currentColors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: currentColors.textSecondary,
      marginTop: 4,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: currentColors.surface,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: currentColors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: currentColors.textSecondary,
    },
    activeTabText: {
      color: currentColors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      minWidth: width * 0.4,
      backgroundColor: currentColors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    statHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    statTitle: {
      fontSize: 12,
      color: currentColors.textSecondary,
      fontWeight: "500",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: currentColors.text,
      marginBottom: 4,
    },
    statChange: {
      fontSize: 12,
      fontWeight: "500",
    },
    positiveChange: {
      color: currentColors.success,
    },
    negativeChange: {
      color: currentColors.error,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentColors.text,
    },
    viewAllButton: {
      color: currentColors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    card: {
      backgroundColor: currentColors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      color: currentColors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: currentColors.textSecondary,
      marginBottom: 2,
    },
    userRole: {
      fontSize: 12,
      color: currentColors.primary,
      fontWeight: "500",
    },
    userStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    statusActive: {
      backgroundColor: currentColors.success + "20",
    },
    statusInactive: {
      backgroundColor: currentColors.error + "20",
    },
    statusSuspended: {
      backgroundColor: currentColors.warning + "20",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    statusActiveText: {
      color: currentColors.success,
    },
    statusInactiveText: {
      color: currentColors.error,
    },
    statusSuspendedText: {
      color: currentColors.warning,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: currentColors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: currentColors.text,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: currentColors.primary,
      marginLeft: 8,
    },
    actionButtonText: {
      color: currentColors.text,
      fontSize: 14,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: currentColors.card,
      borderRadius: 16,
      padding: 24,
      width: width * 0.9,
      maxHeight: height * 0.8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: currentColors.text,
    },
    closeButton: {
      padding: 8,
    },
    userDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    userDetailLabel: {
      fontSize: 14,
      color: currentColors.textSecondary,
      fontWeight: "500",
    },
    userDetailValue: {
      fontSize: 14,
      color: currentColors.text,
      fontWeight: "600",
    },
    buttonGroup: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: currentColors.primary,
    },
    secondaryButton: {
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    primaryButtonText: {
      color: currentColors.text,
    },
    secondaryButtonText: {
      color: currentColors.text,
    },
    dangerButton: {
      backgroundColor: currentColors.error,
    },
    dangerButtonText: {
      color: currentColors.text,
    },
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleUserAction = (user, action) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: action === "delete" ? "destructive" : "default",
          onPress: () => {
            if (action === "delete") {
              setUsers(users.filter((u) => u.id !== user.id));
            } else if (action === "suspend") {
              setUsers(
                users.map((u) =>
                  u.id === user.id ? { ...u, status: "Suspended" } : u
                )
              );
            } else if (action === "activate") {
              setUsers(
                users.map((u) =>
                  u.id === user.id ? { ...u, status: "Active" } : u
                )
              );
            }
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return [styles.statusActive, styles.statusActiveText];
      case "Inactive":
        return [styles.statusInactive, styles.statusInactiveText];
      case "Suspended":
        return [styles.statusSuspended, styles.statusSuspendedText];
      default:
        return [styles.statusInactive, styles.statusInactiveText];
    }
  };

  const renderDashboard = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Total Users</Text>
            <Users size={20} color={currentColors.primary} />
          </View>
          <Text style={styles.statValue}>{dashboardStats.totalUsers}</Text>
          <Text style={[styles.statChange, styles.positiveChange]}>
            +{dashboardStats.monthlyGrowth}% this month
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Active Reports</Text>
            <FileText size={20} color={currentColors.warning} />
          </View>
          <Text style={styles.statValue}>{dashboardStats.activeReports}</Text>
          <Text style={[styles.statChange, styles.positiveChange]}>
            +5 from yesterday
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Resolved</Text>
            <CheckCircle size={20} color={currentColors.success} />
          </View>
          <Text style={styles.statValue}>{dashboardStats.resolvedReports}</Text>
          <Text style={[styles.statChange, styles.positiveChange]}>
            +12 this week
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Pending</Text>
            <Clock size={20} color={currentColors.error} />
          </View>
          <Text style={styles.statValue}>{dashboardStats.pendingReports}</Text>
          <Text style={[styles.statChange, styles.negativeChange]}>
            +3 from yesterday
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Users</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        {users.slice(0, 3).map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => {
              setSelectedUser(user);
              setModalVisible(true);
            }}
          >
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>{user.role}</Text>
              </View>
              <View style={getStatusStyle(user.status)}>
                <Text style={styles.statusText}>{user.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        {reports.slice(0, 3).map((report) => (
          <View key={report.id} style={styles.card}>
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{report.title}</Text>
                <Text style={styles.userEmail}>{report.location}</Text>
                <Text style={styles.userRole}>
                  {report.category} • {report.priority} Priority
                </Text>
              </View>
              <View style={getStatusStyle(report.status)}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.searchContainer}>
        <Search size={20} color={currentColors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={currentColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => {
              setSelectedUser(user);
              setModalVisible(true);
            }}
          >
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>{user.role}</Text>
                <Text style={styles.userEmail}>
                  Last active: {user.lastActive}
                </Text>
              </View>
              <View style={getStatusStyle(user.status)}>
                <Text style={styles.statusText}>{user.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );

  const renderReports = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.searchContainer}>
        <Search size={20} color={currentColors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search reports..."
          placeholderTextColor={currentColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {reports
        .filter(
          (report) =>
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((report) => (
          <View key={report.id} style={styles.card}>
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{report.title}</Text>
                <Text style={styles.userEmail}>{report.location}</Text>
                <Text style={styles.userRole}>
                  {report.category} • {report.priority} Priority
                </Text>
                <Text style={styles.userEmail}>
                  Submitted by: {report.submittedBy}
                </Text>
              </View>
              <View style={getStatusStyle(report.status)}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Dark Mode</Text>
              <Text style={styles.userEmail}>
                Switch between light and dark themes
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsDarkMode(!isDarkMode)}
              style={styles.actionButton}
            >
              {isDarkMode ? (
                <Moon size={20} color={currentColors.text} />
              ) : (
                <Sun size={20} color={currentColors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Push Notifications</Text>
              <Text style={styles.userEmail}>
                Receive notifications for new reports
              </Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <BellRing size={20} color={currentColors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Profile Settings</Text>
              <Text style={styles.userEmail}>Manage your account</Text>
            </View>
            <UserCircle size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.userCard} onPress={async () => {
            await logout();
            navigation.navigate("Login");
          }}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Logout</Text>
              <Text style={styles.userEmail}>Sign out of your account</Text>
            </View>
            <LogOut size={20} color={currentColors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Manage users, reports, and system settings
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsDarkMode(!isDarkMode)}
              style={styles.actionButton}
            >
              {isDarkMode ? (
                <Sun size={20} color={currentColors.text} />
              ) : (
                <Moon size={20} color={currentColors.text} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Bell size={20} color={currentColors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "dashboard" && styles.activeTab]}
          onPress={() => setSelectedTab("dashboard")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "dashboard" && styles.activeTabText,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "users" && styles.activeTab]}
          onPress={() => setSelectedTab("users")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "users" && styles.activeTabText,
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "reports" && styles.activeTab]}
          onPress={() => setSelectedTab("reports")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "reports" && styles.activeTabText,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "settings" && styles.activeTab]}
          onPress={() => setSelectedTab("settings")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "settings" && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedTab === "dashboard" && renderDashboard()}
        {selectedTab === "users" && renderUsers()}
        {selectedTab === "reports" && renderReports()}
        {selectedTab === "settings" && renderSettings()}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={currentColors.text} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Name</Text>
                  <Text style={styles.userDetailValue}>
                    {selectedUser.name}
                  </Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Email</Text>
                  <Text style={styles.userDetailValue}>
                    {selectedUser.email}
                  </Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Role</Text>
                  <Text style={styles.userDetailValue}>
                    {selectedUser.role}
                  </Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Status</Text>
                  <View style={getStatusStyle(selectedUser.status)}>
                    <Text style={styles.statusText}>{selectedUser.status}</Text>
                  </View>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Last Active</Text>
                  <Text style={styles.userDetailValue}>
                    {selectedUser.lastActive}
                  </Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.userDetailLabel}>Reports Submitted</Text>
                  <Text style={styles.userDetailValue}>
                    {selectedUser.reportsSubmitted}
                  </Text>
                </View>

                <View style={styles.buttonGroup}>
                  {selectedUser.status === "Active" ? (
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => handleUserAction(selectedUser, "suspend")}
                    >
                      <Text style={styles.secondaryButtonText}>Suspend</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={() => handleUserAction(selectedUser, "activate")}
                    >
                      <Text style={styles.primaryButtonText}>Activate</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.button, styles.dangerButton]}
                    onPress={() => handleUserAction(selectedUser, "delete")}
                  >
                    <Text style={styles.dangerButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminDashboard;
