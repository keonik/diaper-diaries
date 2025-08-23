import { useChildren } from '@/hooks/use-children';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';
import { ChevronDown, Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChildSelectorProps {
  onPress?: () => void;
}

export function ChildSelector({ onPress }: ChildSelectorProps) {
  const { theme } = useTheme();
  const { selectedChild, children, getChildAge } = useChildren();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/children' as any);
    }
  };

  if (!selectedChild && children.length === 0) {
    return (
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => router.push('/add-child' as any)}
        testID="add-first-child-button"
      >
        <Plus size={20} color={theme.primary} />
        <Text style={[styles.addText, { color: theme.primary }]}>
          Add Your First Child
        </Text>
      </TouchableOpacity>
    );
  }

  if (!selectedChild) {
    return (
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={handlePress}
        testID="select-child-button"
      >
        <Text style={[styles.selectText, { color: theme.text.light }]}>
          Select a child
        </Text>
        <ChevronDown size={20} color={theme.text.light} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={handlePress}
      testID="child-selector"
    >
      <View style={styles.childInfo}>
        <Text style={[styles.childName, { color: theme.text.primary }]}>
          {selectedChild.name}
        </Text>
        <Text style={[styles.childAge, { color: theme.text.light }]}>
          {getChildAge(selectedChild)}
        </Text>
      </View>
      <ChevronDown size={20} color={theme.text.light} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  childAge: {
    fontSize: 14,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectText: {
    fontSize: 16,
  },
});