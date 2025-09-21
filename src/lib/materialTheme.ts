import { createTheme, ThemeOptions } from '@mui/material';
import { Poppins } from 'next/font/google';

const poppinsFont = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin'],
});

// Helper: make 25 shadows (MUI requires exactly 25)
const makeShadows = (overrides: Partial<Record<number, string>>): string[] => {
  const shadows = Array(25).fill('none') as string[];
  Object.entries(overrides).forEach(([key, value]) => {
    shadows[+key] = value;
  });
  return shadows;
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    common: {
      black: '#030712',
      white: '#fff',
    },
    primary: {
      main: '#8e51ff',
    },
    secondary: {
      main: '#8e51ff',
      light: '#f8fafc',
    },
    background: {
      paper: '#ffffff',
      default: '#ffffff',
    },
    text: {
      primary: '#030712',
      secondary: '#6B7280',
    },
    success: {
      main: '#22c55e',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: poppinsFont.style.fontFamily,
  },
  shadows: makeShadows({
    1: '0px 2px 1px -1px rgba(0,0,0,0.150),0px 1px 1px 0px rgba(0,0,0,0.150),0px 1px 3px 0px rgba(0,0,0,0.150)',
    8: '0 5px 5px rgba(0, 0,0,0.15)',
  }),
} as ThemeOptions);

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    common: {
      black: '#030712',
      white: '#fff',
    },
    primary: {
      main: '#8e51ff',
    },
    background: {
      paper: '#0b0a10',
      default: '#0b0a10',
    },
    text: {
      primary: '#d4d4d4',
      secondary: '#9ca3af',
    },
    action: {
      active: '#9ca3af',
    },
  },
  typography: {
    fontFamily: poppinsFont.style.fontFamily,
  },
  shadows: makeShadows({
    1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    8: '0 5px 5px rgba(0, 0,0,0.15)',
  }),
} as ThemeOptions);
