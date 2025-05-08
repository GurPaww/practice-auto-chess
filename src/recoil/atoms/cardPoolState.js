// src/recoil/atoms/cardPoolState.js
import { atom } from 'recoil';
import cardConfig from '../../data/cardConfig.json';

export const initialPool = cardConfig.cards
  .filter(c => c.level === 1)
  .flatMap(c =>
    Array(cardConfig.settings.copiesPerCard).fill(c.id)
  );

export const cardPoolState = atom({
  key: 'cardPoolState',
  default: initialPool,
});
