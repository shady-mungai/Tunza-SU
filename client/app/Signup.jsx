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
import axios from 'axios'
import Toast from 'react-native-toast-message'

import { Picker } from '@react-native-picker/picker' // Make sure to install this package
import { useState, useRef } from 'react'
import { validatePassword, validateEmail, validateName, validatePhone } from "../src/utils/validation"
import { useAuth } from '../src/contexts/AuthContexts'
import { useNavigation } from '@react-navigation/native'
const { width } = Dimensions.get("window")

const Signup = () => {
    const { register } = useAuth();
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        admission_number: "", // Fixed: was admission_number
        phone_number: "", // Fixed: was phone_number_number
        role: "",
        password: "",
        confirmPassword: ""
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

    // Add validation states for real-time feedback
    const [validationErrors, setValidationErrors] = useState({
        name: "",
        email: "",
        admission_number: "",
        phone_number: "",
        role: "",
        password: "",
        confirmPassword: ""
    })

    const [fieldsTouched, setFieldsTouched] = useState({
        name: false,
        email: false,
        admission_number: false,
        phone_number: false,
        role: false,
        password: false,
        confirmPassword: false
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
            fields: ["admission_number", "phone_number", "role"],
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
  
    // Fixed: Proper React Native input change handler with real-time validation
    function handleInputChange(field, value) {
        console.log(`Input changed - Field: ${field}, Value: ${value}`);
        
        setFormData(prevData => {
            const newData = {
                ...prevData,
                [field]: value
            };
            console.log('Updated form data:', newData);
            return newData;
        });

        // Mark field as touched
        setFieldsTouched(prev => ({
            ...prev,
            [field]: true
        }));

        // Real-time validation
        validateField(field, value);

        if (field === "password") {
            const strength = validatePassword(value);
            console.log('Password strength:', strength);
            setPasswordStrength(strength);
        }
    }

    // Real-time field validation
    const validateField = (field, value) => {
        let error = "";

        switch (field) {
            case "name":
                if (value.trim()) {
                    const validation = validateName(value);
                    error = validation.message;
                }
                break;
            case "email":
                if (value.trim()) {
                    const validation = validateEmail(value);
                    error = validation.message;
                }
                break;
            case "admission_number":
                if (value.trim() && value.length < 3) {
                    error = "Admission number must be at least 3 characters";
                }
                break;
            case "phone_number":
                if (value.trim()) {
                    const validation = validatePhone(value);
                    error = validation.message;
                }
                break;
            case "confirmPassword":
                if (value.trim() && formData.password !== value) {
                    error = "Passwords do not match";
                }
                break;
        }

        setValidationErrors(prev => ({
            ...prev,
            [field]: error
        }));
    }

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields

        for (const field of currentFields) {
            const value = formData[field];

            // Check for empty/undefined values first
            if (!value || (typeof value === 'string' && !value.trim())) {
                Alert.alert("Error", `Please fill in the ${getFieldDisplayName(field)} field`)
                return false
            }

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
                case "admission_number":
                    if (value.length < 3) {
                        Alert.alert("Error", "Please enter a valid admission number (at least 3 characters)")
                        return false
                    }
                    break
                case "phone_number":
                    if (!validatePhone(value).isValid) {
                        Alert.alert("Error", "Please enter a valid phone_number")
                        return false
                    }
                    break
                case "role":
                    if (!value || value === "") {
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

    // Helper function to get user-friendly field names
    const getFieldDisplayName = (field) => {
        const fieldNames = {
            name: "name",
            email: "email",
            admission_number: "admission number",
            phone_number: "phone_number",
            role: "role",
            password: "password",
            confirmPassword: "confirm password"
        }
        return fieldNames[field] || field
    }

    const nextStep = () => {
        console.log('Next button clicked, current step:', currentStep);
        console.log('Current form data:', formData);
        
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                const newStep = currentStep + 1;
                console.log('Moving to step:', newStep);
                setCurrentStep(newStep);
                // Remove animation for now to test if it's causing issues
                // animateSlide(newStep)
            } else {
                handleSignup()
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            // Remove animation for now
            // animateSlide(newStep)
        }
    }


    const handleSignup = async () => {
        setIsLoading(true)
        const success = await register({
            name: formData.name,
            email: formData.email,
            admission_number: formData.admission_number,
            phone_number: formData.phone_number,
            role: formData.role,
            password: formData.password,
        });
        setIsLoading(false)
        if (success) {
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Account created successfully',
                visibilityTime: 3000,
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create account. Please try again.',
            });
        }
    }

    const renderProgressBar = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
            {steps.map((_, index) => (
                <View
                    key={index}
                    style={{
                        height: 4,
                        marginHorizontal: 2,
                        borderRadius: 2,
                        backgroundColor: index <= currentStep ? "#2563eb" : "#d1d5db",
                        width: (width - 64) / steps.length - 8
                    }}
                />
            ))}
        </View>
    )

    const renderStep1 = () => (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: 8 
                }}>
                    First & last name *
                </Text>
                <TextInput
                    style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: validationErrors.name ? "#f87171" : 
                            (fieldsTouched.name && formData.name.trim() && !validationErrors.name) ? "#34d399" : 
                            "#d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                        backgroundColor: 'white',
                        color: '#111827'
                    }}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    autoFocus
                />
                {fieldsTouched.name && !formData.name.trim() && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Name is required</Text>
                )}
                {validationErrors.name && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{validationErrors.name}</Text>
                )}
                {fieldsTouched.name && formData.name.trim() && !validationErrors.name && (
                    <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Valid name</Text>
                )}
            </View>

            <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: 8 
                }}>
                    Email *
                </Text>
                <TextInput
                    style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: validationErrors.email ? "#f87171" : 
                            (fieldsTouched.email && formData.email.trim() && !validationErrors.email) ? "#34d399" : 
                            "#d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                        backgroundColor: 'white',
                        color: '#111827'
                    }}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {fieldsTouched.email && !formData.email.trim() && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Email is required</Text>
                )}
                {validationErrors.email && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{validationErrors.email}</Text>
                )}
                {fieldsTouched.email && formData.email.trim() && !validationErrors.email && (
                    <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Valid email</Text>
                )}
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>You'll use this email to sign in to your account</Text>
            </View>
        </View>
    )

    const renderStep2 = () => (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: 8 
                }}>
                    Admission Number *
                </Text>
                <TextInput
                    style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: validationErrors.admission_number ? "#f87171" : 
                            (fieldsTouched.admission_number && formData.admission_number.trim() && !validationErrors.admission_number) ? "#34d399" : 
                            "#d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                        backgroundColor: 'white',
                        color: '#111827'
                    }}
                    value={formData.admission_number}
                    onChangeText={(value) => handleInputChange("admission_number", value)}
                    placeholder="Enter your admission number"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="characters"
                    autoFocus
                />
                {fieldsTouched.admission_number && !formData.admission_number.trim() && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Admission number is required</Text>
                )}
                {validationErrors.admission_number && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{validationErrors.admission_number}</Text>
                )}
                {fieldsTouched.admission_number && formData.admission_number.trim() && formData.admission_number.length >= 3 && (
                    <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Valid admission number</Text>
                )}
            </View>

            <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: 8 
                }}>
                    Phone number *
                </Text>
                <TextInput
                    style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: validationErrors.phone_number ? "#f87171" : 
                            (fieldsTouched.phone_number && formData.phone_number.trim() && !validationErrors.phone_number) ? "#34d399" : 
                            "#d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                        backgroundColor: 'white',
                        color: '#111827'
                    }}
                    value={formData.phone_number}
                    onChangeText={(value) => handleInputChange("phone_number", value)}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9ca3af"
                />
                {fieldsTouched.phone_number && !formData.phone_number.trim() && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Phone number is required</Text>
                )}
                {validationErrors.phone_number && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{validationErrors.phone_number}</Text>
                )}
                {fieldsTouched.phone_number && formData.phone_number.trim() && !validationErrors.phone_number && (
                    <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Valid phone number</Text>
                )}
            </View>

            <View style={{ marginBottom: 24 }}>
                <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: 8 
                }}>
                    Role *
                </Text>
                <View style={{
                    borderWidth: 1,
                    borderColor: fieldsTouched.role && !formData.role ? "#f87171" : 
                        (fieldsTouched.role && formData.role) ? "#34d399" : 
                        "#d1d5db",
                    borderRadius: 8,
                    backgroundColor: 'white'
                }}>
                    <Picker
                        selectedValue={formData.role}
                        onValueChange={(value) => handleInputChange("role", value)}
                        style={{ height: 48, fontSize: 14 }}
                    >
                        <Picker.Item label="Select your role" value="" />
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Maintenance Staff" value="maintenance" />
                        <Picker.Item label="Staff" value="staff" />
                    </Picker>
                </View>
                {fieldsTouched.role && !formData.role && (
                    <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Please select your role</Text>
                )}
                {fieldsTouched.role && formData.role && (
                    <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Role selected</Text>
                )}
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
            <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: 8 
                    }}>
                        Password *
                    </Text>
                    <TextInput
                        style={{
                            width: '100%',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderWidth: 1,
                            borderColor: fieldsTouched.password && passwordStrength.score < 5 ? "#f87171" : 
                                (fieldsTouched.password && passwordStrength.score >= 5) ? "#34d399" : 
                                "#d1d5db",
                            borderRadius: 8,
                            fontSize: 14,
                            backgroundColor: 'white',
                            color: '#111827'
                        }}
                        value={formData.password}
                        onChangeText={(value) => handleInputChange("password", value)}
                        placeholder="Create a password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        autoCapitalize="none"
                        autoFocus
                    />
                    {fieldsTouched.password && !formData.password.trim() && (
                        <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Password is required</Text>
                    )}
                    {formData.password.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                            <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 12 }}>
                                <View
                                    style={{
                                        height: 8,
                                        borderRadius: 4,
                                        width: `${(passwordStrength.score / 5) * 100}%`,
                                        backgroundColor: getPasswordStrengthColor(),
                                    }}
                                />
                            </View>
                            <Text style={{ 
                                fontSize: 12, 
                                fontWeight: '500', 
                                marginBottom: 12,
                                color: getPasswordStrengthColor()
                            }}>
                                {getPasswordStrengthText()} password
                            </Text>
                            <View style={{ gap: 4 }}>
                                {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                                    <Text key={key} style={{ 
                                        fontSize: 12, 
                                        color: met ? "#10b981" : "#ef4444" 
                                    }}>
                                        {met ? "✓" : "✗"} {getRequirementText(key)}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: 8 
                    }}>
                        Confirm Password *
                    </Text>
                    <TextInput
                        style={{
                            width: '100%',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderWidth: 1,
                            borderColor: validationErrors.confirmPassword ? "#f87171" : 
                                (fieldsTouched.confirmPassword && formData.confirmPassword && !validationErrors.confirmPassword) ? "#34d399" : 
                                "#d1d5db",
                            borderRadius: 8,
                            fontSize: 14,
                            backgroundColor: 'white',
                            color: '#111827'
                        }}
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange("confirmPassword", value)}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {fieldsTouched.confirmPassword && !formData.confirmPassword.trim() && (
                        <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Please confirm your password</Text>
                    )}
                    {validationErrors.confirmPassword && (
                        <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{validationErrors.confirmPassword}</Text>
                    )}
                    {fieldsTouched.confirmPassword && formData.confirmPassword && !validationErrors.confirmPassword && (
                        <Text style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ Passwords match</Text>
                    )}
                </View>

                <View style={{ 
                    backgroundColor: '#eff6ff', 
                    padding: 24, 
                    borderRadius: 8 
                }}>
                    <Text style={{ fontSize: 14, color: '#1e40af' }}>
                        Hint: Use a mix of letters, numbers, and symbols to create a strong password
                    </Text>
                </View>
            </View>
        )
    }

    const renderStep4 = () => (
        <View style={{ flex: 1 }}>
            <View style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: 8, 
                padding: 24, 
                marginBottom: 24 
            }}>
                <Text style={{ 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    marginBottom: 16 
                }}>
                    Account Summary
                </Text>

                <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Name:</Text>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{formData.name}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Email:</Text>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{formData.email}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Admission:</Text>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{formData.admission_number}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Phone number:</Text>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{formData.phone_number}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Role:</Text>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14, textTransform: 'capitalize' }}>{formData.role}</Text>
                    </View>
                </View>
            </View>

            <View style={{ 
                backgroundColor: '#f0fdf4', 
                padding: 24, 
                borderRadius: 8 
            }}>
                <Text style={{ fontSize: 14, color: '#166534' }}>
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
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#f9fafb' }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
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

                    {/* Progress Bar */}
                    {renderProgressBar()}

                    {/* Step Content */}
                    <View style={{ 
                        backgroundColor: 'white', 
                        borderRadius: 16, 
                        padding: 32,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 8,
                        marginBottom: 32,
                        flex: 1
                    }}>
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ 
                                fontSize: 24, 
                                fontWeight: 'bold', 
                                color: '#111827', 
                                marginBottom: 4 
                            }}>
                                {steps[currentStep].title}
                            </Text>
                            <Text style={{ color: '#6b7280', fontSize: 14 }}>
                                {steps[currentStep].subtitle}
                            </Text>
                        </View>

                        {renderCurrentStep()}
                    </View>

                    {/* Navigation Buttons */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 32 }}>
                        {currentStep > 0 ? (
                            <TouchableOpacity 
                                style={{
                                    paddingHorizontal: 32,
                                    paddingVertical: 16,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db'
                                }} 
                                onPress={prevStep}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#374151', fontWeight: '500', fontSize: 14 }}>Back</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
                                <Text style={{ color: '#2563eb', fontWeight: '500', fontSize: 14 }}>Sign in instead</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                                borderRadius: 8,
                                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3
                            }}
                            onPress={currentStep === steps.length - 1 ? handleSignup : nextStep}                            
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={{ 
                                color: 'white', 
                                fontWeight: '500', 
                                fontSize: 16 
                            }}>
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