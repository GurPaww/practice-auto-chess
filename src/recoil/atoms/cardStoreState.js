// src/recoil/atoms/cardStoreState.js
import { atom } from 'recoil';
import cardConfig from '../../data/cardConfig.json';

export const cardStoreState = atom({
  key: 'cardStoreState',
  // initialize with 5 nulls (whatever set in config)
  default: Array(cardConfig.settings.storeSize).fill(null),
});
