import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Settings,
  Shield,
  LogOut,
  Edit,
  Camera,
  User,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContexts";
import LayoutWrapper from "../src/components/LayoutWrapper";

const Profile = () => {
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Handle logout
  const handleLogout = () => {
    console.log("[Profile] handleLogout called");
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("[Profile] Alert Logout button pressed");
      logout();
    }
  };

  // Create profile sections based on actual user data
  const profileSections = [
    {
      title: "Personal Information",
      icon: <User size={20} color="#228C22" />,
      items: [
        {
          label: "Full Name",
          value: user?.name || "Not provided",
          editable: true,
        },
        {
          label: "Email",
          value: user?.email || "Not provided",
          editable: true,
        },
        {
          label: "Phone",
          value: user?.phone_number || user?.phoneNumber || "Not provided",
          editable: true,
        },
        {
          label: user?.role === "student" ? "Admission Number" : "Employee ID",
          value: user?.admission_number || user?.employeeId || "Not provided",
          editable: false,
        },
        {
          label: "Department",
          value: getDepartment(user?.role),
          editable: false,
        },
        { label: "Position", value: getPosition(user?.role), editable: false },
        {
          label: "Role",
          value: getRoleDisplayName(user?.role),
          editable: false,
        },
        { label: "Join Date", value: getJoinDate(), editable: false },
      ],
    },
    {
      title: "Account Settings",
      icon: <Settings size={20} color="#228C22" />,
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
      icon: <Shield size={20} color="#228C22" />,
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

  return (
    <LayoutWrapper>
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
                <Camera size={16} color="#228C22" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "User"}</Text>
              <Text style={styles.profilePosition}>
                {getPosition(user?.role)}
              </Text>
              <Text style={styles.profileDepartment}>
                {getDepartment(user?.role)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#228C22" />
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
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#228C22",
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
    color: "#228C22",
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
    backgroundColor: "#228C22",
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