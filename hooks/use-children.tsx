import { Child } from '@/types/events';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CHILDREN_STORAGE_KEY = 'baby_children';
const SELECTED_CHILD_KEY = 'selected_child_id';

export const [ChildrenProvider, useChildren] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const childrenQuery = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(CHILDREN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((child: any) => ({
          ...child,
          birthDate: new Date(child.birthDate),
          createdAt: new Date(child.createdAt),
        }));
      }
      return [];
    },
  });

  const selectedChildQuery = useQuery({
    queryKey: ['selectedChild'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SELECTED_CHILD_KEY);
      return stored;
    },
  });

  const saveChildrenMutation = useMutation({
    mutationFn: async (newChildren: Child[]) => {
      await AsyncStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(newChildren));
      return newChildren;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });
  const { mutate: saveChildren } = saveChildrenMutation;

  const saveSelectedChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      await AsyncStorage.setItem(SELECTED_CHILD_KEY, childId);
      return childId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedChild'] });
    },
  });
  const { mutate: saveSelectedChild } = saveSelectedChildMutation;

  useEffect(() => {
    if (childrenQuery.data) {
      setChildren(childrenQuery.data);
      
      // Auto-select first child if none selected and children exist
      if (childrenQuery.data.length > 0 && !selectedChildId) {
        const firstChildId = childrenQuery.data[0].id;
        setSelectedChildId(firstChildId);
        saveSelectedChild(firstChildId);
      }
    }
  }, [childrenQuery.data, selectedChildId, saveSelectedChild]);

  useEffect(() => {
    if (selectedChildQuery.data) {
      setSelectedChildId(selectedChildQuery.data);
    }
  }, [selectedChildQuery.data]);

  const addChild = useCallback((childData: Omit<Child, 'id' | 'createdAt'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    saveChildren(updatedChildren);
    
    // Auto-select the new child if it's the first one
    if (children.length === 0) {
      setSelectedChildId(newChild.id);
      saveSelectedChild(newChild.id);
    }
    
    return newChild;
  }, [children, saveChildren, saveSelectedChild]);

  const updateChild = useCallback((id: string, updates: Partial<Omit<Child, 'id' | 'createdAt'>>) => {
    const updatedChildren = children.map(child => 
      child.id === id ? { ...child, ...updates } : child
    );
    setChildren(updatedChildren);
    saveChildren(updatedChildren);
  }, [children, saveChildren]);

  const deleteChild = useCallback((id: string) => {
    const updatedChildren = children.filter(child => child.id !== id);
    setChildren(updatedChildren);
    saveChildren(updatedChildren);
    
    // If deleted child was selected, select another one
    if (selectedChildId === id) {
      const newSelectedId = updatedChildren.length > 0 ? updatedChildren[0].id : null;
      setSelectedChildId(newSelectedId);
      if (newSelectedId) {
        saveSelectedChild(newSelectedId);
      }
    }
  }, [children, selectedChildId, saveChildren, saveSelectedChild]);

  const selectChild = useCallback((id: string) => {
    setSelectedChildId(id);
    saveSelectedChild(id);
  }, [saveSelectedChild]);

  const selectedChild = useMemo(() => {
    return children.find(child => child.id === selectedChildId) || null;
  }, [children, selectedChildId]);

  const getChildAge = useCallback((child: Child) => {
    const now = new Date();
    const birthDate = new Date(child.birthDate);
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} year${years === 1 ? '' : 's'} old`;
      }
      return `${years}y ${remainingMonths}m old`;
    }
  }, []);

  return useMemo(() => ({
    children,
    selectedChild,
    selectedChildId,
    addChild,
    updateChild,
    deleteChild,
    selectChild,
    getChildAge,
    isLoading: childrenQuery.isLoading || selectedChildQuery.isLoading,
    isSaving: saveChildrenMutation.isPending || saveSelectedChildMutation.isPending,
  }), [
    children,
    selectedChild,
    selectedChildId,
    addChild,
    updateChild,
    deleteChild,
    selectChild,
    getChildAge,
    childrenQuery.isLoading,
    selectedChildQuery.isLoading,
    saveChildrenMutation.isPending,
    saveSelectedChildMutation.isPending,
  ]);
});