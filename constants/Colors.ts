export type Theme = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  success: string;
  warning: string;
  error: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
    inverse: string;
  };
  diaper: {
    pee: string;
    poop: string;
    both: string;
  };
  feeding: {
    breast: string;
    bottle: string;
  };
  sleep: {
    asleep: string;
    awake: string;
  };
  border: string;
  shadow: string;
};

export const lightTheme: Theme = {
  primary: '#9B7EDE',
  primaryLight: '#C4B5FD',
  primaryDark: '#7C3AED',
  
  accent: '#FFB6C1',
  accentLight: '#FFD6E0',
  
  background: '#F8F9FA',
  surface: '#FFFFFF',
  
  success: '#7DD3C0',
  warning: '#FDE68A',
  error: '#FCA5A5',
  
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  diaper: {
    pee: '#FDE68A',
    poop: '#D4A574',
    both: '#F97316',
  },
  
  feeding: {
    breast: '#FFB6C1',
    bottle: '#93C5FD',
  },
  
  sleep: {
    asleep: '#6366F1',
    awake: '#F59E0B',
  },
  
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme: Theme = {
  primary: '#9B7EDE',
  primaryLight: '#C4B5FD',
  primaryDark: '#7C3AED',
  
  accent: '#FFB6C1',
  accentLight: '#FFD6E0',
  
  background: '#111827',
  surface: '#1F2937',
  
  success: '#7DD3C0',
  warning: '#FDE68A',
  error: '#FCA5A5',
  
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    light: '#9CA3AF',
    inverse: '#1F2937',
  },
  
  diaper: {
    pee: '#FDE68A',
    poop: '#D4A574',
    both: '#F97316',
  },
  
  feeding: {
    breast: '#FFB6C1',
    bottle: '#93C5FD',
  },
  
  sleep: {
    asleep: '#6366F1',
    awake: '#F59E0B',
  },
  
  border: '#374151',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Legacy export for backward compatibility
export const Colors = lightTheme;
export default lightTheme;