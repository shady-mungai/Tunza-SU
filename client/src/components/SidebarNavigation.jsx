import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  LayoutDashboard,
  ListTodo,
  ListChecks,
  Users,
  BarChart,
  UserCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react-native";
import { useAuth } from "../contexts/AuthContexts";

const { width } = Dimensions.get("window");

const SidebarNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Try to get auth context, but handle the case where it's not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // If auth context is not available, use default values
    console.log("Auth context not available, using default navigation");
    user = { role: "student" }; // Default to student role
  }

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

  // Get role-specific dashboard subtitle
  const getDashboardSubtitle = () => {
    switch (user?.role) {
      case "student":
        return "Student Dashboard";
      case "maintenance_staff":
        return "Maintenance Dashboard";
      case "staff":
        return "Staff Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Dashboard";
    }
  };

  // Get role-specific navigation items
  const getNavItems = () => {
    const baseItems = [
      {
        icon: (
          <LayoutDashboard size={20} color="#97D60E" style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "StudentDashboard",
        showFor: ["student"],
      },
      {
        icon: <ListChecks size={20} color="#97D60E" style={styles.navIcon} />,
        text: "My Reports",
        route: "MyReports",
        showFor: ["student"],
      },
      {
        icon: (
          <LayoutDashboard size={20} color="#97D60E" style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "Maintenance Dashboard",
        showFor: ["maintenance_staff"],
      },
      {
        icon: (
          <LayoutDashboard size={20} color="#97D60E" style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "Dashboard",
        showFor: ["staff", "admin"],
      },
      {
        icon: <ListTodo size={20} color="#97D60E" style={styles.navIcon} />,
        text: "All Reports",
        route: "AllReports",
        showFor: ["staff", "admin"],
      },
      {
        icon: <ListChecks size={20} color="#97D60E" style={styles.navIcon} />,
        text: "Assigned Reports",
        route: "AssignedReports",
        showFor: ["maintenance_staff"],
      },
      {
        icon: <BarChart size={20} color="#97D60E" style={styles.navIcon} />,
        text: "Analytics",
        route: "Analytics",
        showFor: ["admin"],
      },
      {
        icon: <UserCircle size={20} color="#97D60E" style={styles.navIcon} />,
        text: "Profile",
        route: "Profile",
        showFor: ["student", "maintenance_staff", "admin"],
      },
      {
        icon: <HelpCircle size={20} color="#97D60E" style={styles.navIcon} />,
        text: "Help",
        route: "Help",
        showFor: ["student", "maintenance_staff", "admin"],
      },
    ];

    return baseItems.filter((item) =>
      user?.role
        ? item.showFor.includes(user.role)
        : item.showFor.includes("student")
    );
  };

  const navItems = getNavItems();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <Text style={styles.appTitle}>TunzaSU</Text>
      </View>
      <Text style={styles.dashboardSubtitle}>{getDashboardSubtitle()}</Text>
      <View style={styles.navContainer}>
        {navItems.map((item, index) => {
          const isActive = route.name === item.route;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => !isActive && navigation.navigate(item.route)}
            >
              {React.cloneElement(item.icon, {
                color: isActive ? "#97D60E" : "#4B5563",
              })}
              <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#228C22",
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
    backgroundColor: "#97D60E33",
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    color: "#4B5563",
    fontWeight: "500",
    marginLeft: 12,
  },
  activeNavText: {
    color: "#97D60E",
  },
});

export default SidebarNavigation;
