import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useState } from 'react'
import { useAuth } from '../src/contexts/AuthContexts'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const { login, user, loading, logout, loginWithGoogle } = useAuth();
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
      setIsLoading(true);
      const success = await login(email, password);
      setIsLoading(false);
      if (!success) {
        Alert.alert("Login failed", "Invalid credentials");
      }
    };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f9fafb' }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 400, alignSelf: 'center', width: '100%' }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ 
              fontSize: 36, 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: 8 
            }}>
              TunzaSU
            </Text>
            <Text style={{ 
              color: '#6b7280', 
              fontSize: 14, 
              textAlign: 'center' 
            }}>
              Facility Maintenance Reporting System
            </Text>
          </View>

          {/* Continue with Google Button */}
          <TouchableOpacity
            onPress={loginWithGoogle}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              paddingVertical: 12,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            {/* Google logo (optional, use a local asset if available) */}
            {/* <Image source={require('../assets/google-logo.png')} style={{ width: 20, height: 20, marginRight: 8 }} /> */}
            <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 16 }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Login Form */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8
          }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: 4 
              }}>
                Welcome back
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>
                Sign in to your account
              </Text>
            </View>

            {/* Email/Admission Number Field */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: 8 
              }}>
                Email or Admission Number
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email or admission number"
                placeholderTextColor="#9ca3af"
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: 'white',
                  color: '#111827'
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            {/* Password Field */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: 8 
              }}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: 'white',
                  color: '#111827'
                }}
                autoCapitalize="none"
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '500'
              }}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Signup")} activeOpacity={0.7}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#2563eb', 
                    fontWeight: '500' 
                  }}>
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;
