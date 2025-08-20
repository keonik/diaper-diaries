import Colors from '@/constants/colors';
import { useEvents } from '@/hooks/use-events';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddMeasurementScreen() {
  const { addEvent } = useEvents();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if ((!isNaN(weightNum) && weightNum > 0) || (!isNaN(heightNum) && heightNum > 0)) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      addEvent({
        type: 'measurement',
        weight: !isNaN(weightNum) && weightNum > 0 ? weightNum : undefined,
        height: !isNaN(heightNum) && heightNum > 0 ? heightNum : undefined,
        note: note.trim() || undefined,
      });
      router.back();
    }
  };

  const isValid = (parseFloat(weight) > 0) || (parseFloat(height) > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="0.0"
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Height (inches)</Text>
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder="0.0"
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={note}
            onChangeText={setNote}
            placeholder="Add any notes..."
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, !isValid && styles.disabledButton]} 
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
    marginBottom: 12,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text?.primary || '#1F2937',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text?.secondary || '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text?.inverse || '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
});