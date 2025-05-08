// src/recoil/atoms/benchState.js
import { atom } from 'recoil';
import cardConfig from '../../data/cardConfig.json';

export const benchState = atom({
  key: 'benchState',
  default: Array(cardConfig.settings.benchSize).fill(null),
});
