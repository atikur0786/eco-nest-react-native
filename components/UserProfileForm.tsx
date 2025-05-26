import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { UserProfile } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

interface UserProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function UserProfileForm({ profile, onSave }: UserProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Animation values
  const saveButtonScale = useSharedValue(1);
  const formShake = useSharedValue(0);
  
  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if any
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
      
      // Success animation
      saveButtonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    } else {
      // Error animation - shake form
      formShake.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  };
  
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: formShake.value }]
    };
  });
  
  const saveButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }]
    };
  });
  
  const InputField = ({ 
    label, 
    value, 
    field, 
    icon, 
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'none',
  }: { 
    label: string; 
    value: string;
    field: keyof UserProfile;
    icon: React.ReactNode;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        errors[field] ? styles.inputError : null
      ]}>
        {icon}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => handleChange(field, text)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>Manage your personal information</Text>
      </View>
      
      <Animated.View style={[styles.form, formAnimatedStyle]}>
        <InputField 
          label="Full Name"
          value={formData.name}
          field="name"
          icon={<User size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />
        
        <InputField 
          label="Email"
          value={formData.email}
          field="email"
          icon={<Mail size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        
        <InputField 
          label="Phone Number"
          value={formData.phone}
          field="phone"
          icon={<Phone size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        
        <InputField 
          label="Address"
          value={formData.address}
          field="address"
          icon={<MapPin size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
          placeholder="Enter your address"
          autoCapitalize="words"
        />
        
        <View style={styles.rowContainer}>
          <View style={styles.rowItem}>
            <InputField 
              label="City"
              value={formData.city}
              field="city"
              icon={<MapPin size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
              placeholder="City"
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.rowItem}>
            <InputField 
              label="ZIP Code"
              value={formData.zipCode}
              field="zipCode"
              icon={<MapPin size={20} color={Colors.neutral[400]} style={styles.inputIcon} />}
              placeholder="ZIP Code"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <Animated.View style={saveButtonAnimatedStyle}>
          <Pressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
            <Save size={20} color={Colors.white} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  contentContainer: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[500],
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error[500],
  },
  inputIcon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.neutral[800],
  },
  errorText: {
    fontSize: 12,
    color: Colors.error[500],
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginRight: Spacing.sm,
  },
});