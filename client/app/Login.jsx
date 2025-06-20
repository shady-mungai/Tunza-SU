import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
  return (
  <KeyboardAvoidingView className="flex-1 bg-gray-50" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-4xl font-bold text-blue-600 mb-2">TunzaSU</Text>
            <Text className="text-gray-600 text-center">Facility Maintenance Reporting System</Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome back</Text>
            <Text className="text-gray-600 mb-8">Sign in to your account</Text>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email or Admission Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email or admission number"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className={`py-3 rounded-lg ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
             // onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center">
            <Text className="text-gray-600">
              Don't have an account?{" "}
              <Text className="text-blue-600 font-medium" onPress={() => navigation.navigate("Signup")}>
                Create account
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  
  );
};

export default Login;
