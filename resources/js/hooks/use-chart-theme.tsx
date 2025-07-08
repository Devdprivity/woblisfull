import { useEffect, useState } from 'react';

export interface ChartTheme {
  background: string;
  cardBackground: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  grid: string;
  axis: string;
  tooltip: {
    background: string;
    border: string;
    text: string;
  };
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    purple: string;
    orange: string;
  };
}

const lightTheme: ChartTheme = {
  background: '#ffffff',
  cardBackground: '#f8fafc',
  border: '#e2e8f0',
  text: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  grid: '#e2e8f0',
  axis: '#64748b',
  tooltip: {
    background: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    orange: '#f97316',
  },
};

const darkTheme: ChartTheme = {
  background: '#0f172a',
  cardBackground: '#1e293b',
  border: '#334155',
  text: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  grid: '#334155',
  axis: '#94a3b8',
  tooltip: {
    background: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    orange: '#f97316',
  },
};

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(darkTheme);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? darkTheme : lightTheme);
    };

    // Initial theme detection
    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
