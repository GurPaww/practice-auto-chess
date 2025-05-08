// src/recoil/selectors/purchaseSelector.js
import { selector } from 'recoil';
import cardConfig               from '../../data/cardConfig.json';
import { playerResourcesState } from '../atoms/playerResourcesState';
import { benchState }           from '../atoms/benchState';
import { cardStoreState }       from '../atoms/cardStoreState';
import { cardPoolState }        from '../atoms/cardPoolState';

export const purchaseSelector = selector({
  key: 'purchaseSelector',
  get: ({ get }) => get(playerResourcesState),
  set: ({ get, set }, cardId) => {
    console.log('🛒 purchaseSelector:', cardId);

    const res   = get(playerResourcesState);
    const bench = get(benchState);
    const pool  = get(cardPoolState);
    const card  = cardConfig.cards.find(c => c.id === cardId);
    if (!card) return;

    // 1) Insufficient gold? flash gold
    if (res.gold < card.cost.gold) {
      const el = document.getElementById('gold-display');
      if (el) {
        el.classList.add('highlight');
        el.addEventListener('animationend', () => el.classList.remove('highlight'), { once: true });
      }
      return;
    }

    // 2) No free bench slot? flash bench border
    if (!bench.includes(null)) {
      const benchEl = document.querySelector('.bench-area');
      if (benchEl) {
        benchEl.classList.add('highlight-bench');
        benchEl.addEventListener('animationend', () => benchEl.classList.remove('highlight-bench'), { once: true });
      }
      return;
    }

    // 3) Remove one copy from the pool
    {
      const newPool = [...pool];
      const pi = newPool.indexOf(cardId);
      if (pi !== -1) {
        newPool.splice(pi, 1);
        set(cardPoolState, newPool);
        console.log('🛒 purchase: pool length now', newPool.length);
      }
    }

    // 4) Remove from store UI
    const store = [...get(cardStoreState)];
    const si    = store.indexOf(cardId);
    if (si !== -1) store[si] = null;
    set(cardStoreState, store);

    // 5) Place on bench
    let newBench = [...bench];
    const emptySlot = newBench.indexOf(null);
    newBench[emptySlot] = cardId;

    // 6) Merge logic: I→II→III
    const levels = ['I','II','III'];
    let gemReward = 0, didMerge = true;
    while (didMerge) {
      didMerge = false;
      const counts = {};
      newBench.forEach(cid => {
        if (!cid) return;
        const [, base, lvl] = cid.match(/^(.*)_(I|II|III)$/) || [];
        counts[base] = counts[base] || {};
        counts[base][lvl] = (counts[base][lvl] || 0) + 1;
      });
      outer: for (const base in counts) {
        for (let i = 0; i < levels.length - 1; i++) {
          const lvl     = levels[i];
          const nextLvl = levels[i+1];
          if ((counts[base][lvl] || 0) >= 3) {
            let toRemove = 3;
            newBench = newBench.map(cid =>
              cid === `${base}_${lvl}` && toRemove-- > 0 ? null : cid
            );
            const mergeSlot = newBench.indexOf(null);
            if (mergeSlot >= 0) {
              newBench[mergeSlot] = `${base}_${nextLvl}`;
              console.log(`🔀 merged 3×${base}_${lvl} → ${base}_${nextLvl}`);
            }
            gemReward++;
            didMerge = true;
            break outer;
          }
        }
      }
    }

    // 7) Commit bench
    set(benchState, newBench);

    // 8) Award gems + deduct gold
    const newState = {
      ...res,
      gold: res.gold - card.cost.gold,
      gem:  res.gem + gemReward
    };
    set(playerResourcesState, newState);
    console.log('🛒 resources now', newState);
  },
});
