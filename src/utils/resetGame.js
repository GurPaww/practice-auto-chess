// Utility to reset all game-related Recoil atoms
import { useRecoilCallback } from 'recoil';
import { gameState } from '../recoil/atoms/gameState';
import { playerResourcesState } from '../recoil/atoms/playerResourcesState';
import { cardPoolState } from '../recoil/atoms/cardPoolState';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import { storeRefreshCostState } from '../recoil/atoms/storeState';
import { benchState } from '../recoil/atoms/benchState';

// Optionally pass initialResources to set after reset
export function useResetGame(initialResources) {
  return useRecoilCallback(({ reset, set }) => () => {
    reset(gameState);
    reset(playerResourcesState);
    reset(cardPoolState);
    reset(cardStoreState);
    reset(storeRefreshCostState);
    reset(benchState);
    if (initialResources) {
      set(playerResourcesState, initialResources);
    }
  }, [initialResources]);
}
