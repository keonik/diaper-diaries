import { useChildren } from '@/hooks/use-children';
import { useTheme } from '@/hooks/use-theme';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditChildScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children, updateChild, isSaving } = useChildren();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const child = children.find(c => c.id === id);

  useEffect(() => {
    if (child) {
      setName(child.name);
      const date = new Date(child.birthDate);
      setBirthDate(`${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`);
    }
  }, [child]);

  const handleSave = () => {
    if (!child) return;

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your child');
      return;
    }

    if (!birthDate.trim()) {
      Alert.alert('Error', 'Please enter a birth date');
      return;
    }

    // Parse the birth date (expecting MM/DD/YYYY format)
    const dateParts = birthDate.split('/');
    if (dateParts.length !== 3) {
      Alert.alert('Error', 'Please enter birth date in MM/DD/YYYY format');
      return;
    }

    const [month, day, year] = dateParts.map(part => parseInt(part, 10));
    if (isNaN(month) || isNaN(day) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
      Alert.alert('Error', 'Please enter a valid birth date');
      return;
    }

    const parsedBirthDate = new Date(year, month - 1, day);
    if (parsedBirthDate > new Date()) {
      Alert.alert('Error', 'Birth date cannot be in the future');
      return;
    }

    updateChild(child.id, {
      name: name.trim(),
      birthDate: parsedBirthDate,
    });

    router.back();
  };

  if (!child) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen 
          options={{ 
            title: 'Edit Child',
            headerStyle: { backgroundColor: theme.primary },
            headerTintColor: '#FFFFFF',
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text.primary }]}>
            Child not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Edit Child',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: '#FFFFFF',
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text.primary }]}>
              Child&apos;s Name
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                color: theme.text.primary 
              }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter child's name"
              placeholderTextColor={theme.text.light}
              testID="edit-child-name-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text.primary }]}>
              Birth Date
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                color: theme.text.primary 
              }]}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={theme.text.light}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              testID="edit-birth-date-input"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={isSaving}
          testID="save-edit-child-button"
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});