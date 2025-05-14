import { createTamagui } from 'tamagui'
import { config } from '@tamagui/config'
import { themes } from './themes'

const fonts = {
  heading: {
    family: 'Silkscreen, monospace',
    size: { 4: 22, 5: 28, 6: 32 },
    lineHeight: { 4: 28, 5: 32, 6: 36 },
    weight: { 4: '700', 5: '700', 6: '700' },
    letterSpacing: { 4: 0, 5: 0, 6: 0 },
  },
  body: {
    family: 'Silkscreen, monospace',
    size: { 4: 22, 5: 22, 6: 22 },
    lineHeight: { 4: 28, 5: 28, 6: 28 },
    weight: { 4: '400', 5: '400', 6: '400' },
    letterSpacing: { 4: 0, 5: 0, 6: 0 },
  },
};

export default createTamagui({
  themes,
  fonts,
  defaultTheme: 'light',
  font: {
    // Set the default font tokens for Tamagui
    heading: 'heading',
    body: 'body',
  },
  ...config,
})
