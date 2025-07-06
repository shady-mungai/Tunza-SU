import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useAuth } from "../contexts/AuthContexts";

// Import screens
import StudentDashboard from "../components/StudentDashboard";
import MyReports from "../components/MyReports";
import Maintenance from "../../app/maintenanceView";
import AllReports from "../../app/allReports";
import AssignedReports from "../../app/assignedReports";
import Analytics from "../../app/analytics";
import Profile from "../../app/profile";
import Help from "../../app/help";
import GettingStarted from "../../app/gettingStarted";
import Dashboard from "../../app/dashboard";
import AdminDashboard from "../../app/admin";

const Tab = createBottomTabNavigator();

// Student Navigation
const StudentNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12 },
    }}
  >
    <Tab.Screen
      name="StudentDashboard"
      component={StudentDashboard}
      options={{
        tabBarLabel: "Dashboard",
        tabBarIcon: () => <Text>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="MyReports"
      component={MyReports}
      options={{
        tabBarLabel: "My Reports",
        tabBarIcon: () => <Text>📋</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: () => <Text>👤</Text>,
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarIcon: () => <Text>❓</Text>,
      }}
    />
    <Tab.Screen
      name="GettingStarted"
      component={GettingStarted}
      options={{
        tabBarLabel: "Getting Started",
        tabBarIcon: () => <Text>📚</Text>,
      }}
    />
  </Tab.Navigator>
);

// Maintenance Staff Navigation
const MaintenanceNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12 },
    }}
  >
    <Tab.Screen
      name="Maintenance Dashboard"
      component={Maintenance}
      options={{
        tabBarLabel: "Maintenance Dashboard",
        tabBarIcon: () => <Text>⚙️</Text>,
      }}
    />
    <Tab.Screen
      name="AllReports"
      component={AllReports}
      options={{
        tabBarLabel: "All Reports",
        tabBarIcon: () => <Text>📊</Text>,
      }}
    />
    <Tab.Screen
      name="AssignedReports"
      component={AssignedReports}
      options={{
        tabBarLabel: "Assigned",
        tabBarIcon: () => <Text>✅</Text>,
      }}
    />
    <Tab.Screen
      name="Analytics"
      component={Analytics}
      options={{
        tabBarLabel: "Analytics",
        tabBarIcon: () => <Text>📈</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: () => <Text>👤</Text>,
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarIcon: () => <Text>❓</Text>,
      }}
    />
    <Tab.Screen
      name="GettingStarted"
      component={GettingStarted}
      options={{
        tabBarLabel: "Getting Started",
        tabBarIcon: () => <Text>📚</Text>,
      }}
    />
  </Tab.Navigator>
);

// Staff Navigation
const StaffNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12 },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        tabBarLabel: "Dashboard",
        tabBarIcon: () => <Text>🏢</Text>,
      }}
    />
    <Tab.Screen
      name="AllReports"
      component={AllReports}
      options={{
        tabBarLabel: "All Reports",
        tabBarIcon: () => <Text>📊</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: () => <Text>👤</Text>,
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarIcon: () => <Text>❓</Text>,
      }}
    />
    <Tab.Screen
      name="GettingStarted"
      component={GettingStarted}
      options={{
        tabBarLabel: "Getting Started",
        tabBarIcon: () => <Text>📚</Text>,
      }}
    />
  </Tab.Navigator>
);

// Admin Navigation
const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12 },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboard}
      options={{
        tabBarLabel: "Dashboard",
        tabBarIcon: () => <Text>👑</Text>,
      }}
    />
    <Tab.Screen
      name="AllReports"
      component={AllReports}
      options={{
        tabBarLabel: "All Reports",
        tabBarIcon: () => <Text>📊</Text>,
      }}
    />
    <Tab.Screen
      name="Analytics"
      component={Analytics}
      options={{
        tabBarLabel: "Analytics",
        tabBarIcon: () => <Text>📈</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: () => <Text>👤</Text>,
      }}
    />
    <Tab.Screen
      name="Help"
      component={Help}
      options={{
        tabBarLabel: "Help",
        tabBarIcon: () => <Text>❓</Text>,
      }}
    />
    <Tab.Screen
      name="GettingStarted"
      component={GettingStarted}
      options={{
        tabBarLabel: "Getting Started",
        tabBarIcon: () => <Text>📚</Text>,
      }}
    />
  </Tab.Navigator>
);

// Main Role-Based Navigator
const RoleBasedNavigator = () => {
  const { user } = useAuth();

  console.log(`user role is ${user?.role}`);
  // Determine which navigator to show based on user role
  const getNavigatorByRole = () => {
    switch (user?.role) {
      case "student":
        return <StudentNavigator />;
      case "maintenance_staff":
        return <MaintenanceNavigator />;
      case "staff":
        return <StaffNavigator />;
      case "admin":
        return <AdminNavigator />;
      default:
        return <StudentNavigator />; // Fallback
    }
  };

  return getNavigatorByRole();
};

export default RoleBasedNavigator;
