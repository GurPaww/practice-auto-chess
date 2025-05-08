// src/recoil/atoms/gameState.js
import { atom } from 'recoil';

export const gameState = atom({
  key: 'gameState',
  default: {
    round: 1,
    targetScore: 0,
  },
});

export const gameOverState = atom({
  key: 'gameOverState',
  default: false,
});
