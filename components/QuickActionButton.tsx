import { useTheme } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  color, 
  onPress 
}) => {
  const { theme } = useTheme();
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color, shadowColor: theme.shadow }]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={[styles.label, { color: theme.text.inverse }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});