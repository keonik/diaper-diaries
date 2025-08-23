import { ChildSelector } from '@/components/ChildSelector';
import { DateNavigator } from '@/components/DateNavigator';
import { EventCard } from '@/components/EventCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { useChildren } from '@/hooks/use-children';
import { useEvents } from '@/hooks/use-events';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import { Baby, Droplets, FileText, Moon, RefreshCw, Ruler } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { getEventsForDate, deleteEvent } = useEvents();
  const { theme } = useTheme();
  const { selectedChild } = useChildren();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [getEventsForDate, selectedDate]);
  
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text.primary }]}>
            {selectedChild ? `Hello, ${selectedChild.name}! 👶` : 'Hello, Parent! 👶'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            {selectedChild ? `Track ${selectedChild.name}'s day` : 'Track your baby\'s day'}
          </Text>
        </View>

        <ChildSelector />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickActionButton
              icon={<Droplets size={28} color={theme.text.inverse} />}
              label="Diaper"
              color={theme.diaper.poop}
              onPress={() => router.push('/add-diaper')}
            />
            <QuickActionButton
              icon={<Baby size={28} color={theme.text.inverse} />}
              label="Bottle"
              color={theme.feeding.bottle}
              onPress={() => router.push('/add-bottle')}
            />
            <QuickActionButton
              icon={<RefreshCw size={28} color={theme.text.inverse} />}
              label="Nursing"
              color={theme.feeding.breast}
              onPress={() => router.push('/timer')}
            />
          </View>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              icon={<Ruler size={28} color={theme.text.inverse} />}
              label="Measure"
              color={theme.success}
              onPress={() => router.push('/add-measurement')}
            />
            <QuickActionButton
              icon={<FileText size={28} color={theme.text.inverse} />}
              label="Note"
              color={theme.text.secondary}
              onPress={() => router.push('/add-note')}
            />
            <QuickActionButton
              icon={<Moon size={28} color={theme.text.inverse} />}
              label="Sleep"
              color={theme.sleep.asleep}
              onPress={() => router.push('/add-sleep')}
            />
          </View>
        </View>

        <DateNavigator 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            {isToday ? 'Today\'s Events' : 'Events'}
          </Text>
          {selectedDateEvents.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                {isToday ? 'No events today' : 'No events on this day'}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.text.light }]}>
                {isToday ? 'Start tracking your baby\'s activities' : 'Try selecting a different date'}
              </Text>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {selectedDateEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onDelete={deleteEvent}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  eventsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
});