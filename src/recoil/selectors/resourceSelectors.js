// src/recoil/selectors/resourceSelectors.js
import { selector } from 'recoil';
import { gameState } from '../atoms/gameState';
import { playerResourcesState } from '../atoms/playerResourcesState';

export const initialResourcesSelector = selector({
  key: 'initialResourcesSelector',
  get: ({ get }) => {
    const { round } = get(gameState);
    const prevGems = get(playerResourcesState).gem;
    return {
      gold: 10 + 2 * round,
      gem: prevGems,
    };
  },
});
