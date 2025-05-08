// src/recoil/atoms/storeState.js
import { atom } from 'recoil';
import cardConfig from '../../data/cardConfig.json';

export const storeSizeState = atom({
  key: 'storeSizeState',
  default: cardConfig.settings.storeSize,
});

export const storeRefreshCostState = atom({
  key: 'storeRefreshCostState',
  default: cardConfig.settings.refreshCost ?? 1,
});
