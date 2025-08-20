import Colors from '@/constants/colors';
import { useEvents } from '@/hooks/use-events';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddBottleScreen() {
  const { addEvent } = useEvents();
  const [ounces, setOunces] = useState('');
  const [formulaType, setFormulaType] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const ouncesNum = parseFloat(ounces);
    if (!isNaN(ouncesNum) && ouncesNum > 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      addEvent({
        type: 'bottle',
        ounces: ouncesNum,
        formulaType: formulaType.trim() || undefined,
        note: note.trim() || undefined,
      });
      router.back();
    }
  };

  const quickAmounts = [2, 4, 6, 8];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label}>Amount (oz)</Text>
          <TextInput
            style={styles.textInput}
            value={ounces}
            onChangeText={setOunces}
            placeholder="0.0"
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
            keyboardType="decimal-pad"
          />
          
          <View style={styles.quickButtons}>
            {quickAmounts.map(amount => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => setOunces(amount.toString())}
              >
                <Text style={styles.quickButtonText}>{amount} oz</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Formula/Milk Type (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={formulaType}
            onChangeText={setFormulaType}
            placeholder="e.g., Breast milk, Formula brand..."
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
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
              style={[styles.saveButton, (!ounces || parseFloat(ounces) <= 0) && styles.disabledButton]} 
              onPress={handleSave}
              disabled={!ounces || parseFloat(ounces) <= 0}
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
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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