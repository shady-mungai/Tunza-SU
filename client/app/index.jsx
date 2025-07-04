import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./Login";
import Signup from "./Signup";
import StudentDashboard from "../src/components/StudentDashboard";
import MyReports from "../src/components/MyReports";
import AllReports from "./all_reports";
import "../global.css";
import { AuthProvider, useAuth } from "../src/contexts/AuthContexts";
import Help from "./help";
import AssignedReports from "./assigned_reports";
import Profile from "./profile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Student Dash"
        component={StudentDashboard}
        options={{ tabBarIcon: () => <Text>⚙️</Text> }}
      />
      <Tab.Screen
        name="My Reports"
        component={MyReports}
        options={{ tabBarIcon: () => <Text>⚠️</Text> }}
      />
      {/* <Tab.Screen name="Map View" component={MapScreen} options={{ tabBarIcon: () => <Text>📍</Text> }} /> */}
      {/* <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} /> */}
      {/* <Tab.Screen name="Help" component={HelpScreen} options={{ tabBarIcon: () => <Text>❓</Text> }} /> */}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="AllReports" component={AllReports} />
          <Stack.Screen name="AssignedReports" component={AssignedReports} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Help" component={Help} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      )}
    </Stack.Navigator>
  );
}

const Home = () => {
  return (
    <AuthProvider>
      <NavigationIndependentTree>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </NavigationIndependentTree>
    </AuthProvider>
  );
};

export default Home;
