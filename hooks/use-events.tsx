import { BabyEvent } from '@/types/events';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChildren } from './use-children';

const STORAGE_KEY = 'baby_events';

export const [EventsProvider, useEvents] = createContextHook(() => {
  const queryClient = useQueryClient();
  const { selectedChildId } = useChildren();
  const [allEvents, setAllEvents] = useState<BabyEvent[]>([]);

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
          childId: event.childId || 'default', // Handle legacy events without childId
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
      setAllEvents(eventsQuery.data);
    }
  }, [eventsQuery.data]);

  // Filter events for selected child
  const events = useMemo(() => {
    if (!selectedChildId) return [];
    return allEvents.filter(event => event.childId === selectedChildId);
  }, [allEvents, selectedChildId]);

  const addEvent = useCallback((event: any) => {
    if (!selectedChildId) {
      console.warn('No child selected, cannot add event');
      return;
    }
    
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      childId: selectedChildId,
      timestamp: event.timestamp || new Date(),
    };
    
    const updatedAllEvents = [newEvent as BabyEvent, ...allEvents];
    setAllEvents(updatedAllEvents);
    saveEvents(updatedAllEvents);
  }, [allEvents, selectedChildId, saveEvents]);

  const deleteEvent = useCallback((id: string) => {
    const updatedAllEvents = allEvents.filter(e => e.id !== id);
    setAllEvents(updatedAllEvents);
    saveEvents(updatedAllEvents);
  }, [allEvents, saveEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<BabyEvent>) => {
    const updatedAllEvents = allEvents.map(e => 
      e.id === id ? { ...e, ...updates } as BabyEvent : e
    );
    setAllEvents(updatedAllEvents);
    saveEvents(updatedAllEvents);
  }, [allEvents, saveEvents]);

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

  const getAllEventsForChild = useCallback((childId: string) => {
    return allEvents.filter(event => event.childId === childId);
  }, [allEvents]);

  return useMemo(() => ({
    events,
    allEvents,
    recentEvents,
    todayEvents,
    getEventsForDate,
    getAllEventsForChild,
    addEvent,
    deleteEvent,
    updateEvent,
    isLoading: eventsQuery.isLoading,
    isSaving: saveMutation.isPending,
  }), [events, allEvents, recentEvents, todayEvents, getEventsForDate, getAllEventsForChild, addEvent, deleteEvent, updateEvent, eventsQuery.isLoading, saveMutation.isPending]);
});