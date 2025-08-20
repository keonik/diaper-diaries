import { darkTheme, lightTheme, Theme } from '@/constants/colors';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'theme_mode';

function getSystemTheme(): 'light' | 'dark' {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

function getThemeColors(mode: ThemeMode): Theme {
  if (mode === 'system') {
    return getSystemTheme() === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
}

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  const theme = getThemeColors(themeMode);
  const isDark = themeMode === 'dark' || (themeMode === 'system' && getSystemTheme() === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          setThemeMode(stored as ThemeMode);
        }
      } catch (error) {
        console.log('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const handleSystemThemeChange = () => {
      if (themeMode === 'system') {
        // Force re-render when system theme changes
        setThemeMode('system');
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
    } else {
      const subscription = Appearance.addChangeListener(handleSystemThemeChange);
      return () => subscription?.remove();
    }
  }, [themeMode]);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.log('Failed to save theme preference:', error);
      setThemeMode(mode); // Still update the state even if storage fails
    }
  }, []);

  return useMemo(() => ({
    theme,
    themeMode,
    isDark,
    isLoaded,
    setTheme,
  }), [theme, themeMode, isDark, isLoaded, setTheme]);
});

export type ThemeContextType = ReturnType<typeof useTheme>;