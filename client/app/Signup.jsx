import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native"
import { useState, useRef } from 'react'
import { validatePassword, validateEmail, validateName, validatePhone } from "../src/utils/validation"
const { width } = Dimensions.get("window")

const Signup = () => {
    const [
        currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name:"",
        email: "",
        admission_number:"",
        phone_number:"",
        role:"",
        password:"",
        confirmPassword:""
    })
    // to check the strength of the password
    const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  })

    const slideAnim = useRef(new Animated.Value(0)).current

      const steps = [
    {
      title: "Create your TunzaSU account",
      subtitle: "Enter your name and email to get started",
      fields: ["name", "email"],
    },
    {
      title: "Add your details",
      subtitle: "We need some additional information",
      fields: ["admissionNumber", "phone", "role"],
    },
    {
      title: "Choose a password",
      subtitle: "Create a strong password to secure your account",
      fields: ["password", "confirmPassword"],
    },
    {
      title: "Review your information",
      subtitle: "Make sure everything looks correct",
      fields: [],
    },
  ]
  
 function handleInputChange(e) {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value
  });

  if (name === "password") {
    const strength = validatePassword(value);
    setPasswordStrength(strength);
  }
}
const validateCurrentStep = ()=>{
    const currentFields = steps[currentStep].fields



    for (const field of currentFields) {
      const value = formData[field];

      switch (field) {
        case "name":
          if (!validateName(value).isValid) {
            Alert.alert("Error", "Please enter a valid name (at least 2 characters, letters only)")
            return false
          }
          break
        case "email":
          if (!validateEmail(value).isValid) {
            Alert.alert("Error", "Please enter a valid email address")
            return false
          }
          break
        case "admissionNumber":
          if (!value.trim() || value.length < 3) {
            Alert.alert("Error", "Please enter a valid admission number (at least 3 characters)")
            return false
          }
          break
        case "phone":
          if (!validatePhone(value).isValid) {
            Alert.alert("Error", "Please enter a valid phone number")
            return false
          }
          break
        case "role":
          if (!value) {
            Alert.alert("Error", "Please select your role")
            return false
          }
          break
        case "password":
          if (passwordStrength.score < 5) {
            Alert.alert("Error", "Password must meet all security requirements")
            return false
          }
          break
        case "confirmPassword":
          if (formData.password !== formData.confirmPassword) {
            Alert.alert("Error", "Passwords do not match")
            return false
          }
          break
      }
    }

    return true
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep++)
        animateSlide()
      } else {
        handleSignup()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      animateSlide()
    }
  }

  const animateSlide = () => {
    Animated.timing(slideAnim, {
      toValue: currentStep * -width,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const handleSignup = async () => {
    setIsLoading(true)
    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        admissionNumber: formData.admissionNumber,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      })

      if (success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.replace("Dashboard") },
        ])
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderProgressBar = () => (
    <View className="flex-row justify-center mb-8">
      {steps.map((_, index) => (
        <View
          key={index}
          className={`h-1 mx-1 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
          style={{ width: width / steps.length - 16 }}
        />
      ))}
    </View>
  )

  const renderStep1 = () => (
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">First & last name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholder="Enter your full name"
          autoCapitalize="words"
          autoFocus
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text className="text-xs text-gray-500 mt-1">You'll use this email to sign in to your account</Text>
      </View>
    </View>
  )

  const renderStep2 = () => (
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Admission Number</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
          value={formData.admissionNumber}
          onChangeText={(value) => handleInputChange("admission_number", value)}
          placeholder="Enter your admission number"
          autoCapitalize="characters"
          autoFocus
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone_number", value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Role</Text>
        <View className="border border-gray-300 rounded-lg bg-white">
          <Picker
            selectedValue={formData.role}
            onValueChange={(value) => handleInputChange("role", value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select your role" value="" />
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Maintenance Staff" value="maintenance" />
            <Picker.Item label="Staff" value="staff" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>
    </View>
  )

  const renderStep3 = () => {
    const getPasswordStrengthColor = () => {
      if (passwordStrength.score >= 5) return "#10b981"
      if (passwordStrength.score >= 3) return "#f59e0b"
      return "#ef4444"
    }

    const getPasswordStrengthText = () => {
      if (passwordStrength.score >= 5) return "Strong"
      if (passwordStrength.score >= 3) return "Medium"
      return "Weak"
    }

    return (
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            placeholder="Create a password"
            secureTextEntry
            autoCapitalize="none"
            autoFocus
          />
          {formData.password.length > 0 && (
            <View className="mt-3">
              <View className="h-1 bg-gray-200 rounded-full mb-2">
                <View
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                />
              </View>
              <Text className="text-xs font-medium mb-2" style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthText()} password
              </Text>
              <View className="space-y-1">
                {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                  <Text key={key} className={`text-xs ${met ? "text-green-600" : "text-red-500"}`}>
                    {met ? "✓" : "✗"} {getRequirementText(key)}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            placeholder="Confirm your password"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View className="bg-blue-50 p-4 rounded-lg">
          <Text className="text-sm text-blue-800">
            💡 Use a mix of letters, numbers, and symbols to create a strong password
          </Text>
        </View>
      </View>
    )
  }

  const renderStep4 = () => (
    <View className="flex-1">
      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Account Summary</Text>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Name:</Text>
            <Text className="font-medium text-gray-900">{formData.name}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Email:</Text>
            <Text className="font-medium text-gray-900">{formData.email}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Admission:</Text>
            <Text className="font-medium text-gray-900">{formData.admissionNumber}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Phone:</Text>
            <Text className="font-medium text-gray-900">{formData.phone}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Role:</Text>
            <Text className="font-medium text-gray-900 capitalize">{formData.role}</Text>
          </View>
        </View>
      </View>

      <View className="bg-green-50 p-4 rounded-lg">
        <Text className="text-sm text-green-800">
          ✅ By creating an account, you agree to TunzaSU's Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1()
      case 1:
        return renderStep2()
      case 2:
        return renderStep3()
      case 3:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-gray-50" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-12">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-blue-600 mb-2">TunzaSU</Text>
            <Text className="text-sm text-gray-600 text-center">Facility Maintenance Reporting System</Text>
          </View>

          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex-1">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</Text>
              <Text className="text-gray-600">{steps[currentStep].subtitle}</Text>
            </View>

            {renderCurrentStep()}
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center pb-6">
            {currentStep > 0 ? (
              <TouchableOpacity className="px-6 py-3 rounded-lg border border-gray-300" onPress={prevStep}>
                <Text className="text-gray-700 font-medium">Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-blue-600 font-medium">Sign in instead</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`px-8 py-3 rounded-lg ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
              onPress={nextStep}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? "Creating..." : currentStep === steps.length - 1 ? "Create Account" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const getRequirementText = (key) => {
  switch (key) {
    case "length":
      return "At least 8 characters"
    case "uppercase":
      return "One uppercase letter"
    case "lowercase":
      return "One lowercase letter"
    case "number":
      return "One number"
    case "special":
      return "One special character"
    default:
      return ""
  }
}

export default Signup