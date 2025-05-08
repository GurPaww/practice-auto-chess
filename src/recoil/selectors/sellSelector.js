// src/recoil/selectors/sellSelector.js
import { selector } from 'recoil';
import cardConfig               from '../../data/cardConfig.json';
import { benchState }           from '../atoms/benchState';
import { cardPoolState }        from '../atoms/cardPoolState';
import { playerResourcesState } from '../atoms/playerResourcesState';

export const sellSelector = selector({
  key: 'sellSelector',

  // READ: return current resources
  get: ({ get }) => get(playerResourcesState),

  // WRITE: remove from bench, return to pool (array), refund gold
  set: ({ get, set }, cardId) => {
    // 1) remove card from bench
    const bench = [...get(benchState)];
    const idx   = bench.indexOf(cardId);
    if (idx === -1) return;
    bench[idx] = null;
    set(benchState, bench);

    // 2) return copies to pool-array
    // parse base ID and level suffix
    const m = cardId.match(/^(card_.+?)_(I|II|III)$/);
    if (m) {
      const baseId     = `${m[1]}_I`;                // always add back level-I units
      const level      = m[2];                       // 'I','II','III'
      const multiplier = { I:1, II:3, III:9 }[level] || 1;
      const poolArr    = [...get(cardPoolState)];
      const toReturn   = Array(multiplier).fill(baseId);
      set(cardPoolState, poolArr.concat(toReturn));
      console.log('🔄 sellSelector: returned', multiplier, baseId, '→ pool size', poolArr.length + multiplier);
    }

    // 3) refund gold at full cost
    const res  = get(playerResourcesState);
    const card = cardConfig.cards.find(c => c.id === cardId);
    const refund = card?.cost?.gold || 0;
    set(playerResourcesState, {
      ...res,
      gold: res.gold + refund,
    });
    console.log('🔄 sellSelector: refunded gold', refund);
  },
});
