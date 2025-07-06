import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Signup from "./Signup";
import "../global.css";
import { AuthProvider, useAuth } from "../src/contexts/AuthContexts";
import RoleBasedNavigator from "../src/navigation/RoleBasedNavigator";

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

const styles = StyleSheet.create({

})

