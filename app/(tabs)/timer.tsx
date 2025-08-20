import Colors from '@/constants/colors';
import { useEvents } from '@/hooks/use-events';
import { useTimer } from '@/hooks/use-timer';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeftRight, Pause, Play, Plus, RotateCw, Save } from 'lucide-react-native';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimerScreen() {
  const timer = useTimer();
  const { addEvent } = useEvents();
  const router = useRouter();

  const handleStart = (side: 'left' | 'right') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    timer.startTimer(side);
  };

  const handlePause = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    timer.pauseTimer();
  };

  const handleSwitch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    timer.switchSide();
  };

  const handleReset = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    timer.resetTimer();
  };

  const handleSave = () => {
    if (timer.totalDuration > 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      addEvent({
        type: 'breastfeed',
        leftDuration: timer.leftDuration,
        rightDuration: timer.rightDuration,
        startSide: timer.leftDuration > 0 ? 'left' : 'right',
      });
      timer.resetTimer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Breastfeeding Timer</Text>
        
        <View style={styles.timerContainer}>
          <View style={styles.sideTimer}>
            <Text style={styles.sideLabel}>Left</Text>
            <View style={[
              styles.timeDisplay,
              timer.currentSide === 'left' && timer.isRunning && styles.activeTimer
            ]}>
              <Text style={styles.timeText}>{timer.formatTime(timer.leftDuration)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.sideTimer}>
            <Text style={styles.sideLabel}>Right</Text>
            <View style={[
              styles.timeDisplay,
              timer.currentSide === 'right' && timer.isRunning && styles.activeTimer
            ]}>
              <Text style={styles.timeText}>{timer.formatTime(timer.rightDuration)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Time</Text>
          <Text style={styles.totalTime}>{timer.formatTime(timer.totalDuration)}</Text>
        </View>

        <View style={styles.controls}>
          {!timer.isRunning ? (
            <>
              <TouchableOpacity
                style={[styles.controlButton, styles.startButton]}
                onPress={() => handleStart('left')}
              >
                <Play size={24} color={Colors.text?.inverse || '#FFFFFF'} />
                <Text style={styles.buttonText}>Start Left</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.startButton]}
                onPress={() => handleStart('right')}
              >
                <Play size={24} color={Colors.text?.inverse || '#FFFFFF'} />
                <Text style={styles.buttonText}>Start Right</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={handlePause}
              >
                <Pause size={24} color={Colors.text?.inverse || '#FFFFFF'} />
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.switchButton]}
                onPress={handleSwitch}
              >
                <ArrowLeftRight size={24} color={Colors.text?.inverse || '#FFFFFF'} />
                <Text style={styles.buttonText}>Switch</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.resetButton]}
            onPress={handleReset}
          >
            <RotateCw size={20} color={Colors.error} />
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, styles.saveButton, timer.totalDuration === 0 && styles.disabledButton]}
            onPress={handleSave}
            disabled={timer.totalDuration === 0}
          >
            <Save size={20} color={timer.totalDuration > 0 ? Colors.success : Colors.text?.light || '#9CA3AF'} />
            <Text style={[
              styles.secondaryButtonText,
              { color: timer.totalDuration > 0 ? Colors.success : Colors.text?.light || '#9CA3AF' }
            ]}>Save Session</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.manualEntrySection}>
          <Text style={styles.manualEntryLabel}>Add past session?</Text>
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={() => router.push('/add-nursing')}
          >
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.manualEntryText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text?.primary || '#1F2937',
    textAlign: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  sideTimer: {
    flex: 1,
    alignItems: 'center',
  },
  sideLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text?.secondary || '#6B7280',
    marginBottom: 12,
  },
  timeDisplay: {
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTimer: {
    backgroundColor: Colors.primaryLight,
    transform: [{ scale: 1.05 }],
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text?.primary || '#1F2937',
  },
  divider: {
    width: 1,
    height: 80,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.text?.secondary || '#6B7280',
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: Colors.success,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  switchButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.text?.inverse || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    backgroundColor: Colors.surface,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: 'transparent',
  },
  saveButton: {
    borderWidth: 1,
    borderColor: Colors.success,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.error,
  },
  manualEntrySection: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  manualEntryLabel: {
    fontSize: 14,
    color: Colors.text?.secondary || '#6B7280',
    marginBottom: 12,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    gap: 8,
  },
  manualEntryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
});