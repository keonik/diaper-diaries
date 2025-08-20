import { useEvents } from '@/hooks/use-events';
import { useTheme } from '@/hooks/use-theme';
import { SleepEvent } from '@/types/events';
import * as Haptics from 'expo-haptics';
import { router, Stack } from 'expo-router';
import { Clock, Moon, Sun } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AddSleepScreen() {
  const { addEvent, events } = useEvents();
  const { theme } = useTheme();
  const [customTime] = useState<Date>(new Date());

  // Find the most recent sleep event to determine current status
  const lastSleepEvent = useMemo(() => {
    const sleepEvents = events.filter(e => e.type === 'sleep') as SleepEvent[];
    return sleepEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }, [events]);

  const currentStatus = lastSleepEvent?.status || 'awake';
  const isCurrentlyAsleep = currentStatus === 'asleep';

  // Calculate current sleep duration if baby is asleep
  const [currentSleepDuration, setCurrentSleepDuration] = useState<number>(0);

  useEffect(() => {
    if (isCurrentlyAsleep && lastSleepEvent) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - lastSleepEvent.timestamp.getTime()) / 1000);
        setCurrentSleepDuration(duration);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCurrentlyAsleep, lastSleepEvent]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleSleepToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const newStatus = isCurrentlyAsleep ? 'awake' : 'asleep';
    let duration: number | undefined;

    // If baby is waking up, calculate sleep duration
    if (newStatus === 'awake' && lastSleepEvent && lastSleepEvent.status === 'asleep') {
      const now = new Date();
      duration = Math.floor((now.getTime() - lastSleepEvent.timestamp.getTime()) / 1000);
    }

    const sleepEvent: Omit<SleepEvent, 'id'> = {
      type: 'sleep',
      status: newStatus,
      timestamp: new Date(),
      duration,
    };

    addEvent(sleepEvent);
    router.back();
  };

  const handleManualEntry = (status: 'asleep' | 'awake') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const sleepEvent: Omit<SleepEvent, 'id'> = {
      type: 'sleep',
      status,
      timestamp: customTime,
    };

    addEvent(sleepEvent);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Sleep Tracking',
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text.primary,
        }} 
      />
      
      <View style={styles.content}>
        {/* Current Status Display */}
        <View style={[styles.statusCard, { backgroundColor: theme.surface }]}>
          <View style={styles.statusHeader}>
            {isCurrentlyAsleep ? (
              <Moon size={32} color={theme.sleep.asleep} />
            ) : (
              <Sun size={32} color={theme.sleep.awake} />
            )}
            <Text style={[styles.statusTitle, { color: theme.text.primary }]}>
              Baby is {isCurrentlyAsleep ? 'Sleeping' : 'Awake'}
            </Text>
          </View>
          
          {isCurrentlyAsleep && (
            <View style={styles.durationContainer}>
              <Clock size={16} color={theme.text.secondary} />
              <Text style={[styles.durationText, { color: theme.text.secondary }]}>
                Sleep duration: {formatDuration(currentSleepDuration)}
              </Text>
            </View>
          )}
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            { 
              backgroundColor: isCurrentlyAsleep ? theme.sleep.awake : theme.sleep.asleep,
              shadowColor: theme.shadow 
            }
          ]}
          onPress={handleSleepToggle}
          activeOpacity={0.8}
        >
          {isCurrentlyAsleep ? (
            <Sun size={40} color={theme.text.inverse} />
          ) : (
            <Moon size={40} color={theme.text.inverse} />
          )}
          <Text style={[styles.mainButtonText, { color: theme.text.inverse }]}>
            Mark as {isCurrentlyAsleep ? 'Awake' : 'Asleep'}
          </Text>
        </TouchableOpacity>

        {/* Manual Time Entry Section */}
        <View style={[styles.manualSection, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Manual Entry
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.text.secondary }]}>
            Add past sleep events
          </Text>
          
          <View style={styles.timeSelector}>
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: theme.background }]}
              onPress={() => {
                // In a real app, you'd open a date/time picker here
                Alert.alert('Time Picker', 'Time picker would open here');
              }}
            >
              <Clock size={16} color={theme.text.secondary} />
              <Text style={[styles.timeButtonText, { color: theme.text.primary }]}>
                {customTime.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.manualButtons}>
            <TouchableOpacity
              style={[styles.manualButton, { backgroundColor: theme.sleep.asleep }]}
              onPress={() => handleManualEntry('asleep')}
              activeOpacity={0.8}
            >
              <Moon size={20} color={theme.text.inverse} />
              <Text style={[styles.manualButtonText, { color: theme.text.inverse }]}>
                Fell Asleep
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.manualButton, { backgroundColor: theme.sleep.awake }]}
              onPress={() => handleManualEntry('awake')}
              activeOpacity={0.8}
            >
              <Sun size={20} color={theme.text.inverse} />
              <Text style={[styles.manualButtonText, { color: theme.text.inverse }]}>
                Woke Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    gap: 24,
  },
  statusCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statusHeader: {
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderRadius: 20,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  manualSection: {
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  timeSelector: {
    marginBottom: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  manualButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  manualButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});