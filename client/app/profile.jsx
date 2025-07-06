import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  Bell,
  Settings,
  Shield,
  LogOut,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContexts";

const { width } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      student: "Student",
      maintenance_staff: "Maintenance Staff",
      staff: "Staff",
      admin: "Administrator",
    };
    return roleNames[role] || "User";
  };

  // Get department based on role
  const getDepartment = (role) => {
    const departments = {
      student: "Student Affairs",
      maintenance_staff: "Facilities & Maintenance",
      staff: "Administration",
      admin: "IT Administration",
    };
    return departments[role] || "General";
  };

  // Get position based on role
  const getPosition = (role) => {
    const positions = {
      student: "Student",
      maintenance_staff: "Maintenance Personnel",
      staff: "Staff Member",
      admin: "System Administrator",
    };
    return positions[role] || "User";
  };

  // Format join date (using current date as fallback)
  const getJoinDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            // Navigation will be handled by the auth context
          },
        },
      ]
    );
  };

  // Create profile sections based on actual user data
  const profileSections = [
    {
      title: "Personal Information",
      icon: <User size={20} color="#2563EB" />,
      items: [
        { label: "Full Name", value: user?.name || "Not provided", editable: true },
        { label: "Email", value: user?.email || "Not provided", editable: true },
        { label: "Phone", value: user?.phone_number || user?.phoneNumber || "Not provided", editable: true },
        {
          label: user?.role === "student" ? "Admission Number" : "Employee ID",
          value: user?.admission_number || user?.employeeId || "Not provided",
          editable: false,
        },
        { label: "Department", value: getDepartment(user?.role), editable: false },
        { label: "Position", value: getPosition(user?.role), editable: false },
        { label: "Role", value: getRoleDisplayName(user?.role), editable: false },
        { label: "Join Date", value: getJoinDate(), editable: false },
      ],
    },
    {
      title: "Account Settings",
      icon: <Settings size={20} color="#2563EB" />,
      items: [
        {
          label: "Change Password",
          value: "Last changed 3 months ago",
          action: "changePassword",
        },
        {
          label: "Two-Factor Authentication",
          value: "Enabled",
          action: "toggle2FA",
        },
        {
          label: "Email Notifications",
          value: "All notifications enabled",
          action: "notifications",
        },
        { label: "Language", value: "English", action: "language" },
        { label: "Theme", value: "Light", action: "theme" },
      ],
    },
    {
      title: "Security & Privacy",
      icon: <Shield size={20} color="#2563EB" />,
      items: [
        {
          label: "Login History",
          value: "View recent logins",
          action: "loginHistory",
        },
        {
          label: "Active Sessions",
          value: "2 active sessions",
          action: "sessions",
        },
        {
          label: "Privacy Settings",
          value: "Manage data sharing",
          action: "privacy",
        },
        { label: "Data Export", value: "Download your data", action: "export" },
      ],
    },
  ];

  // Get role-specific dashboard subtitle
  const getDashboardSubtitle = () => {
    switch (user?.role) {
      case 'student':
        return 'Student Dashboard';
      case 'maintenance':
        return 'Maintenance Dashboard';
      case 'staff':
        return 'Staff Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Get role-specific navigation items
  const getNavItems = () => {
    const baseItems = [
      {
        icon: <LayoutDashboard size={20} color="#4B5563" style={styles.navIcon} />,
        text: "Dashboard",
        route: "dashboard",
        showFor: ["student", "maintenance", "staff", "admin"]
      },
      {
        icon: <ListTodo size={20} color="#4B5563" style={styles.navIcon} />,
        text: "All Reports",
        route: "all_reports",
        showFor: ["maintenance", "staff", "admin"]
      },
      {
        icon: <ListChecks size={20} color="#4B5563" style={styles.navIcon} />,
        text: "Assigned Reports",
        route: "assigned_reports",
        showFor: ["maintenance"]
      },
      {
        icon: <BarChart size={20} color="#4B5563" style={styles.navIcon} />,
        text: "Analytics",
        route: "analytics",
        showFor: ["maintenance", "admin"]
      },
      {
        icon: <UserCircle size={20} color="#2563EB" style={styles.navIcon} />,
        text: "Profile",
        route: "profile",
        showFor: ["student", "maintenance", "staff", "admin"],
        isActive: true
      },
      {
        icon: <HelpCircle size={20} color="#4B5563" style={styles.navIcon} />,
        text: "Help",
        route: "help",
        showFor: ["student", "maintenance", "staff", "admin"]
      },
    ];

    return baseItems.filter(item => 
      item.showFor.includes(user?.role) || item.showFor.includes("admin")
    );
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
        <Text style={styles.dashboardSubtitle}>{getDashboardSubtitle()}</Text>
        <View style={styles.navContainer}>
          {getNavItems().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.navItem,
                item.isActive && styles.activeNavItem
              ]}
              onPress={() => !item.isActive && navigation.navigate(item.route)}
            >
              {item.icon}
              <Text style={[
                styles.navText,
                item.isActive && styles.activeNavText
              ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color="#FFFFFF" />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "User"}</Text>
              <Text style={styles.profilePosition}>{getPosition(user?.role)}</Text>
              <Text style={styles.profileDepartment}>
                {getDepartment(user?.role)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>{section.icon}</View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.profileItem}
                  onPress={() =>
                    item.action && console.log(`Action: ${item.action}`)
                  }
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemValue}>{item.value}</Text>
                  </View>
                  {item.editable && (
                    <TouchableOpacity style={styles.editItemButton}>
                      <Edit size={16} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                  {item.action && (
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionText}>Change</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
  header: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  editButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  editItemButton: {
    padding: 8,
  },
  actionButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Profile;
