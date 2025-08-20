import Colors from '@/constants/colors';
import { useEvents } from '@/hooks/use-events';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddDiaperScreen() {
  const { addEvent } = useEvents();
  const [diaperType, setDiaperType] = useState<'pee' | 'poop' | 'both'>('pee');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    addEvent({
      type: 'diaper',
      diaperType,
      note: note.trim() || undefined,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, diaperType === 'pee' && styles.selectedType]}
              onPress={() => setDiaperType('pee')}
            >
              <Text style={[styles.typeButtonText, diaperType === 'pee' && styles.selectedTypeText]}>
                💧 Pee
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, diaperType === 'poop' && styles.selectedType]}
              onPress={() => setDiaperType('poop')}
            >
              <Text style={[styles.typeButtonText, diaperType === 'poop' && styles.selectedTypeText]}>
                💩 Poop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, diaperType === 'both' && styles.selectedType]}
              onPress={() => setDiaperType('both')}
            >
              <Text style={[styles.typeButtonText, diaperType === 'both' && styles.selectedTypeText]}>
                🔄 Both
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={styles.textInput}
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedType: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 16,
    color: Colors.text?.secondary || '#6B7280',
  },
  selectedTypeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text?.primary || '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
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
});