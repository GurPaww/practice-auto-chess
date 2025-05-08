// src/recoil/selectors/scoreSelectors.js
import { selector } from 'recoil';
import cardConfig from '../../data/cardConfig.json';
import { benchState } from '../atoms/benchState';
import { gameState } from '../atoms/gameState';

export const benchScoreSelector = selector({
  key: 'benchScoreSelector',
  get: ({ get }) => {
    const bench = get(benchState);
    return bench.reduce((sum, cid) => {
      if (!cid) return sum;
      const card = cardConfig.cards.find(c => c.id === cid);
      return sum + (card?.score || 0);
    }, 0);
  }
});

export const targetScoreSelector = selector({
  key: 'targetScoreSelector',
  get: ({ get }) => {
    const { round } = get(gameState);
    return 5 * round;   // placeholder: adjust to taste
  }
});
