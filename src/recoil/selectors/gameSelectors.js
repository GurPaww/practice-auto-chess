// src/recoil/selectors/gameSelectors.js
import { selector } from 'recoil';
import { gameState }             from '../atoms/gameState';
// import { benchState }            from '../atoms/benchState';
import { playerResourcesState }  from '../atoms/playerResourcesState';
import { refreshStoreSelector }  from './storeSelectors';
import { benchScoreSelector, targetScoreSelector } from './scoreSelectors';
// import cardConfig                from '../../data/cardConfig.json';

export const nextRoundSelector = selector({
  key: 'nextRoundSelector',

  // READ: return current game state
  get: ({ get }) => {
    return get(gameState);
  },

  // WRITE: advance round, add gold, refill store (bench persists)
  set: ({ get, set }) => {
    const score  = get(benchScoreSelector);
    const target = get(targetScoreSelector);

    if (score >= target) {
      const prev    = get(gameState);
      const newRnd  = prev.round + 1;
      set(gameState, { ...prev, round: newRnd });

      // accumulate gold
      const res     = get(playerResourcesState);
      const gain    = 10 + 2 * newRnd;
      set(playerResourcesState, {
        ...res,
        gold: res.gold + gain
      });

      // refill store
      set(refreshStoreSelector, null);
    } else {
      console.warn('Game Over: score', score, 'needed', target);
    }
  }
});
