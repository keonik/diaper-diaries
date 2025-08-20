import { useTheme } from '@/hooks/use-theme';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const { theme } = useTheme();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const canGoToNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selectedDate < tomorrow;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TouchableOpacity 
        style={[styles.navButton, { backgroundColor: theme.background }]} 
        onPress={goToPreviousDay}
        activeOpacity={0.7}
      >
        <ChevronLeft size={20} color={theme.text.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.dateContainer} 
        onPress={goToToday}
        activeOpacity={0.7}
      >
        <View style={styles.dateContent}>
          <Calendar size={16} color={theme.text.secondary} />
          <Text style={[styles.dateText, { color: theme.text.primary }]}>
            {formatDate(selectedDate)}
          </Text>
          {!isToday(selectedDate) && (
            <Text style={[styles.tapHint, { color: theme.text.light }]}>Tap for today</Text>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.navButton, 
          { 
            backgroundColor: canGoToNextDay() ? theme.background : theme.surface,
            opacity: canGoToNextDay() ? 1 : 0.3
          }
        ]} 
        onPress={goToNextDay}
        disabled={!canGoToNextDay()}
        activeOpacity={0.7}
      >
        <ChevronRight size={20} color={theme.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateContent: {
    alignItems: 'center',
    gap: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  tapHint: {
    fontSize: 11,
    marginTop: 1,
  },
});