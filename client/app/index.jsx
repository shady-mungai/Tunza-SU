import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { AuthProvider, useAuth } from "../src/contexts/AuthContexts";
import RoleBasedNavigator from "../src/navigation/RoleBasedNavigator";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AllReports from "./allReports";
import "../global.css";
import Help from "./help";
import AssignedReports from "./assignedReports";

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="MainApp" component={RoleBasedNavigator} />
          <Stack.Screen name="AllReports" component={AllReports} />
          <Stack.Screen name="AssignedReports" component={AssignedReports} />
          <Stack.Screen name="Help" component={Help} />
          {/* Add any modal screens or additional screens here */}
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
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default Home;
