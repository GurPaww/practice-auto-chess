// src/recoil/selectors/storeSelectors.js
import { selector } from 'recoil';
import { cardStoreState }        from '../atoms/cardStoreState';
import { cardPoolState }         from '../atoms/cardPoolState';
import { storeSizeState,
         storeRefreshCostState } from '../atoms/storeState';
import { playerResourcesState }  from '../atoms/playerResourcesState';

// Fisher–Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const refreshStoreSelector = selector({
  key: 'refreshStoreSelector',
  get: ({ get }) => get(cardStoreState),
  set: ({ get, set }, shouldCharge = true) => {
    // 1) Optionally charge gold
    if (shouldCharge) {
      const cost = get(storeRefreshCostState);
      const res  = get(playerResourcesState);
      if (res.gold < cost) {
        const el = document.getElementById('gold-display');
        if (el) {
          el.classList.add('highlight');
          el.addEventListener(
            'animationend',
            () => el.classList.remove('highlight'),
            { once: true }
          );
        }
        console.warn('Not enough gold to refresh');
        return;
      }
      set(playerResourcesState, { ...res, gold: res.gold - cost });
      console.log(`🔄 refreshStore: deducted ${cost} gold, now ${res.gold - cost}`);
    }

    // 2) Build or convert pool
    let pool = get(cardPoolState);
    if (!Array.isArray(pool)) {
      console.warn('⚠️ cardPoolState is not an array—converting from object');
      pool = Object.entries(pool)
        .flatMap(([id, count]) => Array(count).fill(id));
    }

    // 3) Draw & set store
    const storeSize = get(storeSizeState);
    console.log('🔄 refillStore: pool length', pool.length, 'storeSize', storeSize);
    const drawn = shuffle(pool).slice(0, storeSize);
    console.log('🔄 refillStore: drawn IDs →', drawn);
    set(cardStoreState, drawn);
  }
});
