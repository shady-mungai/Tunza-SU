import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  LayoutDashboard,
  ListTodo,
  ListChecks,
  BarChart,
  UserCircle,
  HelpCircle,
} from "lucide-react-native";
import { useAuth } from "../contexts/AuthContexts";
import { colors, touchTarget } from "../theme/tokens";

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
          <LayoutDashboard size={20} color={colors.brand} style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "StudentDashboard",
        showFor: ["student"],
      },
      {
        icon: <ListChecks size={20} color={colors.brand} style={styles.navIcon} />,
        text: "My Reports",
        route: "MyReports",
        showFor: ["student"],
      },
      {
        icon: (
          <LayoutDashboard size={20} color={colors.brand} style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "Maintenance Dashboard",
        showFor: ["maintenance_staff"],
      },
      {
        icon: (
          <LayoutDashboard size={20} color={colors.brand} style={styles.navIcon} />
        ),
        text: "Dashboard",
        route: "Dashboard",
        showFor: ["staff", "admin"],
      },
      {
        icon: <ListTodo size={20} color={colors.brand} style={styles.navIcon} />,
        text: "All Reports",
        route: "AllReports",
        showFor: ["staff", "admin"],
      },
      {
        icon: <ListChecks size={20} color={colors.brand} style={styles.navIcon} />,
        text: "Assigned Reports",
        route: "AssignedReports",
        showFor: ["maintenance_staff"],
      },
      {
        icon: <BarChart size={20} color={colors.brand} style={styles.navIcon} />,
        text: "Analytics",
        route: "Analytics",
        showFor: ["admin"],
      },
      {
        icon: <UserCircle size={20} color={colors.brand} style={styles.navIcon} />,
        text: "Profile",
        route: "Profile",
        showFor: ["student", "maintenance_staff", "admin"],
      },
      {
        icon: <HelpCircle size={20} color={colors.brand} style={styles.navIcon} />,
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
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logoImage}
          accessibilityLabel="Tunza SU"
        />
        <Text style={styles.appTitle}>Tunza SU</Text>
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
              accessibilityRole="button"
              accessibilityLabel={item.text}
              accessibilityState={{ selected: isActive }}
            >
              {React.cloneElement(item.icon, {
                color: isActive ? colors.brand : colors.textMuted,
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
    backgroundColor: colors.surface,
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
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  appTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  dashboardSubtitle: {
    color: colors.textMuted,
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
    minHeight: touchTarget,
  },
  activeNavItem: {
    backgroundColor: colors.brandSurface,
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    color: colors.textMuted,
    fontWeight: "500",
    marginLeft: 12,
  },
  activeNavText: {
    color: colors.brand,
  },
});

export default SidebarNavigation;
