import Colors from '@/constants/colors';
import { useEvents } from '@/hooks/use-events';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddNursingScreen() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const [leftMinutes, setLeftMinutes] = useState<string>('');
  const [rightMinutes, setRightMinutes] = useState<string>('');
  const [startSide, setStartSide] = useState<'left' | 'right'>('left');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');

  const handleSave = () => {
    const leftDuration = parseInt(leftMinutes) || 0;
    const rightDuration = parseInt(rightMinutes) || 0;
    
    if (leftDuration === 0 && rightDuration === 0) {
      Alert.alert('Invalid Input', 'Please enter at least one duration.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    addEvent({
      type: 'breastfeed',
      leftDuration: leftDuration * 60, // convert to seconds
      rightDuration: rightDuration * 60, // convert to seconds
      startSide,
      timestamp: selectedDate,
      note: note.trim() || undefined,
    });

    router.back();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours(), time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text?.primary || '#1F2937'} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Nursing Session</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration (minutes)</Text>
          
          <View style={styles.durationContainer}>
            <View style={styles.sideInput}>
              <Text style={styles.sideLabel}>Left Breast</Text>
              <TextInput
                style={styles.input}
                value={leftMinutes}
                onChangeText={setLeftMinutes}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={Colors.text?.light || '#9CA3AF'}
              />
              <Text style={styles.unitLabel}>min</Text>
            </View>
            
            <View style={styles.sideInput}>
              <Text style={styles.sideLabel}>Right Breast</Text>
              <TextInput
                style={styles.input}
                value={rightMinutes}
                onChangeText={setRightMinutes}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={Colors.text?.light || '#9CA3AF'}
              />
              <Text style={styles.unitLabel}>min</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Starting Side</Text>
          <View style={styles.sideSelector}>
            <TouchableOpacity
              style={[styles.sideButton, startSide === 'left' && styles.selectedSide]}
              onPress={() => setStartSide('left')}
            >
              <Text style={[styles.sideButtonText, startSide === 'left' && styles.selectedSideText]}>Left</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sideButton, startSide === 'right' && styles.selectedSide]}
              onPress={() => setStartSide('right')}
            >
              <Text style={[styles.sideButtonText, startSide === 'right' && styles.selectedSideText]}>Right</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.dateTimeText}>{formatDateTime(selectedDate)}</Text>
          </TouchableOpacity>
          
          {Platform.OS !== 'web' && (
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timeButtonText}>Change Time</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add any notes about this session..."
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.text?.light || '#9CA3AF'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color={Colors.text?.inverse || '#FFFFFF'} />
          <Text style={styles.saveButtonText}>Save Session</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  sideInput: {
    flex: 1,
    alignItems: 'center',
  },
  sideLabel: {
    fontSize: 14,
    color: Colors.text?.secondary || '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text?.primary || '#1F2937',
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitLabel: {
    fontSize: 12,
    color: Colors.text?.light || '#9CA3AF',
    marginTop: 4,
  },
  sideSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedSide: {
    backgroundColor: Colors.primary,
  },
  sideButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text?.secondary || '#6B7280',
  },
  selectedSideText: {
    color: Colors.text?.inverse || '#FFFFFF',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTimeText: {
    fontSize: 16,
    color: Colors.text?.primary || '#1F2937',
  },
  timeButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text?.primary || '#1F2937',
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text?.inverse || '#FFFFFF',
  },
});