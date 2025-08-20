import { EventCard } from '@/components/EventCard';
import { useEvents } from '@/hooks/use-events';
import { useTheme } from '@/hooks/use-theme';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const { events, deleteEvent } = useEvents();
  const { theme } = useTheme();

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: typeof events } = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp);
      const dateKey = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return groups;
  }, [events]);

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedDates.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>No events recorded yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.text.light }]}>Start tracking to see your history</Text>
          </View>
        ) : (
          sortedDates.map(date => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: theme.text.secondary }]}>{date}</Text>
              <View style={styles.eventsList}>
                {groupedEvents[date].map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={deleteEvent}
                  />
                ))}
              </View>
            </View>
          ))
        )}
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
    paddingVertical: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  eventsList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});