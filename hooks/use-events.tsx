import { BabyEvent } from '@/types/events';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'baby_events';

export const [EventsProvider, useEvents] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<BabyEvent[]>([]);

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
      return [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newEvents: BabyEvent[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      return newEvents;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
  
  const { mutate: saveEvents } = saveMutation;

  useEffect(() => {
    if (eventsQuery.data) {
      setEvents(eventsQuery.data);
    }
  }, [eventsQuery.data]);

  const addEvent = useCallback((event: any) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: event.timestamp || new Date(),
    };
    
    const updatedEvents = [newEvent as BabyEvent, ...events];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }, [events, saveEvents]);

  const deleteEvent = useCallback((id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }, [events, saveEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<BabyEvent>) => {
    const updatedEvents = events.map(e => 
      e.id === id ? { ...e, ...updates } as BabyEvent : e
    );
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }, [events, saveEvents]);

  const recentEvents = useMemo(() => {
    return events.slice(0, 10);
  }, [events]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(e => e.timestamp >= today);
  }, [events]);

  const getEventsForDate = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return events.filter(e => 
      e.timestamp >= startOfDay && e.timestamp <= endOfDay
    );
  }, [events]);

  return useMemo(() => ({
    events,
    recentEvents,
    todayEvents,
    getEventsForDate,
    addEvent,
    deleteEvent,
    updateEvent,
    isLoading: eventsQuery.isLoading,
    isSaving: saveMutation.isPending,
  }), [events, recentEvents, todayEvents, getEventsForDate, addEvent, deleteEvent, updateEvent, eventsQuery.isLoading, saveMutation.isPending]);
});