import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BadgeCheck,
  CircleHelp,
  ClipboardList,
  Home,
  UserRound,
  Wrench,
} from "lucide-react-native";
import { useAuth } from "../contexts/AuthContexts";
import { colors, touchTarget } from "../theme/tokens";

// Import screens
import StudentDashboard from "../components/StudentDashboard";
import MyReports from "../components/MyReports";
import Maintenance from "../../app/maintenanceView";
import AssignedReports from "../../app/assignedReports";
import Profile from "../../app/profile";
import Help from "../../app/help";
import AdminDashboard from "../../app/admin";

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.brand,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: {
    minHeight: 64,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabBarItemStyle: { minHeight: touchTarget },
  tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
};

const tabIcon = (Icon) =>
  function TabIcon({ color, size }) {
    return <Icon color={color} size={size || 22} strokeWidth={2} />;
  };

// Student Navigation
const StudentNavigator = () => (
  <Tab.Navigator
    screenOptions={screenOptions}
  >
    <Tab.Screen
      name="StudentDashboard"
      component={StudentDashboard}
      options={{
        tabBarLabel: "Dashboard",
        tabBarAccessibilityLabel: "Student dashboard",
        tabBarIcon: tabIcon(Home),
      }}
    />
    <Tab.Screen
      name="MyReports"
      component={MyReports}
      options={{
        tabBarLabel: "My Reports",
        tabBarAccessibilityLabel: "My reports",
        tabBarIcon: tabIcon(ClipboardList),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarAccessibilityLabel: "Profile",
        tabBarIcon: tabIcon(UserRound),
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarAccessibilityLabel: "Help and support",
        tabBarIcon: tabIcon(CircleHelp),
      }}
    />
  </Tab.Navigator>
);

// Maintenance Staff Navigation
const MaintenanceNavigator = () => (
  <Tab.Navigator
    screenOptions={screenOptions}
  >
    <Tab.Screen
      name="Maintenance Dashboard"
      component={Maintenance}
      options={{
        tabBarLabel: "Work",
        tabBarAccessibilityLabel: "Maintenance dashboard",
        tabBarIcon: tabIcon(Wrench),
      }}
    />
  
    <Tab.Screen
      name="AssignedReports"
      component={AssignedReports}
      options={{
        tabBarLabel: "Assigned",
        tabBarAccessibilityLabel: "Assigned reports",
        tabBarIcon: tabIcon(BadgeCheck),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarAccessibilityLabel: "Profile",
        tabBarIcon: tabIcon(UserRound),
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarAccessibilityLabel: "Help and support",
        tabBarIcon: tabIcon(CircleHelp),
      }}
    />
  </Tab.Navigator>
);

// Admin Navigation
const AdminNavigator = () => <AdminDashboard />;

// Main Role-Based Navigator
const RoleBasedNavigator = () => {
  const { user } = useAuth();

  // Determine which navigator to show based on user role
  const getNavigatorByRole = () => {
    switch (user?.role) {
      case "student":
        return <StudentNavigator />;
      case "maintenance_staff":
        return <MaintenanceNavigator />;
      case "admin":
        return <AdminNavigator />;
      default:
        return <StudentNavigator />; // Fallback
    }
  };

  return getNavigatorByRole();
};

export default RoleBasedNavigator;
