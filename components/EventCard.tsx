import { useTheme } from '@/hooks/use-theme';
import { BabyEvent } from '@/types/events';
import * as Haptics from 'expo-haptics';
import { Baby, Clock, Droplets, FileText, Moon, Ruler, Sun, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
  event: BabyEvent;
  onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const { theme } = useTheme();
  
  const getEventIcon = () => {
    switch (event.type) {
      case 'diaper':
        return <Droplets size={20} color={theme.diaper[event.diaperType]} />;
      case 'breastfeed':
        return <Baby size={20} color={theme.feeding.breast} />;
      case 'bottle':
        return <Baby size={20} color={theme.feeding.bottle} />;
      case 'measurement':
        return <Ruler size={20} color={theme.primary} />;
      case 'note':
        return <FileText size={20} color={theme.text.secondary} />;
      case 'sleep':
        return event.status === 'asleep' ? 
          <Moon size={20} color={theme.sleep.asleep} /> : 
          <Sun size={20} color={theme.sleep.awake} />;
    }
  };

  const getEventTitle = () => {
    switch (event.type) {
      case 'diaper':
        return `Diaper Change - ${event.diaperType.charAt(0).toUpperCase() + event.diaperType.slice(1)}`;
      case 'breastfeed':
        const leftMins = Math.floor(event.leftDuration / 60);
        const rightMins = Math.floor(event.rightDuration / 60);
        return `Breastfeeding - L: ${leftMins}min, R: ${rightMins}min`;
      case 'bottle':
        return `Bottle Feeding - ${event.ounces} oz`;
      case 'measurement':
        const parts = [];
        if (event.weight) parts.push(`${event.weight} lbs`);
        if (event.height) parts.push(`${event.height} in`);
        return `Measurement - ${parts.join(', ')}`;
      case 'note':
        return event.title || 'Note';
      case 'sleep':
        if (event.status === 'awake' && event.duration) {
          const hours = Math.floor(event.duration / 3600);
          const minutes = Math.floor((event.duration % 3600) / 60);
          const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
          return `Woke Up - Slept for ${durationText}`;
        }
        return event.status === 'asleep' ? 'Fell Asleep' : 'Woke Up';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDelete?.(event.id);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
        {getEventIcon()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{getEventTitle()}</Text>
        <View style={styles.metaRow}>
          <View style={styles.timeContainer}>
            <Clock size={12} color={theme.text.light} />
            <Text style={[styles.time, { color: theme.text.light }]}>{formatTime(event.timestamp)}</Text>
          </View>
        </View>
        {event.note && <Text style={[styles.note, { color: theme.text.secondary }]}>{event.note}</Text>}
      </View>
      {onDelete && (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
  },
  note: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
});