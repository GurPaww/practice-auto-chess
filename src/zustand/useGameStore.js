import { create } from 'zustand';
import cardConfig from '../data/cardConfig.json';

const getInitialBench = (benchSize) => Array(benchSize).fill(null);
const getInitialStore = (storeSize) => Array(storeSize).fill(null);
const initialBenchSize = cardConfig.settings.benchSize;
const initialStoreSize = cardConfig.settings.storeSize;
const initialPool = cardConfig.cards
  .filter(c => c.level === 1)
  .flatMap(c => Array(cardConfig.settings.copiesPerCard).fill(c.id));

export const useGameStore = create((set, get) => ({
  // State
  benchSize: initialBenchSize,
  storeSize: initialStoreSize,
  bench: getInitialBench(initialBenchSize),
  cardStore: getInitialStore(initialStoreSize),
  cardPool: initialPool,
  resources: { gold: 12, gem: 0 }, // 10 + 2 * 1 for round 1
  round: 1,
  upgrades: [],
  refreshCost: 1,
  gameOver: false,
  discountI: 0,
  // Actions
  setBench: (bench) => set({ bench }),
  setCardStore: (cardStore) => set({ cardStore }),
  setCardPool: (cardPool) => set({ cardPool }),
  setResources: (resources) => set({ resources }),
  setRound: (round) => set({ round }),
  setUpgrades: (upgrades) => set({ upgrades }),
  setRefreshCost: (refreshCost) => set({ refreshCost }),
  setGameOver: (gameOver) => set({ gameOver }),
  setStoreSize: (storeSize) => set({ storeSize }),
  setBenchSize: (benchSize) => set({ benchSize }),
  setDiscountI: (discountI) => set({ discountI }),
  // Dynamic bench/store size actions
  increaseBenchSize: () => {
    const { bench, benchSize } = get();
    set({
      benchSize: benchSize + 1,
      bench: [...bench, null],
    });
  },
  increaseStoreSize: () => {
    const { cardStore, storeSize } = get();
    set({
      storeSize: storeSize + 1,
      cardStore: [...cardStore, null],
    });
  },
  // Derived selectors (examples)
  benchScore: () => {
    const bench = get().bench;
    return bench.reduce((sum, cid) => {
      if (!cid) return sum;
      const card = cardConfig.cards.find(c => c.id === cid);
      return sum + (card?.score || 0);
    }, 0);
  },
  targetScore: () => 5 * get().round,
  // --- Game logic actions ---
  handleRefresh: (charge = true) => {
    const { resources, refreshCost, cardPool, storeSize, setResources, setCardStore, setCardPool } = get();
    if (charge && resources.gold < refreshCost) return;
    if (charge) setResources({ ...resources, gold: resources.gold - refreshCost });
    // Draw new store
    let pool = [...cardPool];
    const drawn = [];
    for (let i = 0; i < storeSize; i++) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      drawn.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setCardStore(drawn.concat(Array(storeSize - drawn.length).fill(null)));
    setCardPool(pool);
  },
  handleNext: () => {
    const { round, setRound, setRefreshCost, refreshCost, benchScore, targetScore, setGameOver } = get();
    setRound(round + 1);
    if ((round + 1) % 3 === 0) setRefreshCost(refreshCost + 1);
    if (benchScore() < targetScore()) setGameOver(true);
  },
  resetGame: () => {
    set({
      benchSize: initialBenchSize,
      storeSize: initialStoreSize,
      bench: getInitialBench(initialBenchSize),
      cardStore: getInitialStore(initialStoreSize),
      cardPool: initialPool,
      resources: { gold: 12, gem: 0 }, // 10 + 2 * 1 for round 1
      round: 1,
      upgrades: [],
      refreshCost: 1,
      gameOver: false,
      discountI: 0,
    });
  },
  isGameOver: (get) => get().gameOver,
  // --- Purchase/Sell logic ---
  purchaseCard: ({ cardId, slotIndex }) => {
    const state = get();
    const card = cardConfig.cards.find(c => c.id === cardId);
    if (!card) return;
    const effectiveCost = card.level === 1 ? Math.max(1, card.cost.gold - state.discountI) : card.cost.gold;
    if (state.resources.gold < effectiveCost) return;
    // Find empty bench slot
    const bench = [...state.bench];
    const emptyIdx = bench.indexOf(null);
    if (emptyIdx === -1) return;
    // Remove from pool
    const pool = [...state.cardPool];
    const pi = pool.indexOf(cardId);
    if (pi !== -1) pool.splice(pi, 1);
    // Remove from store
    const store = [...state.cardStore];
    let si = typeof slotIndex === 'number' ? slotIndex : store.indexOf(cardId);
    if (si !== -1) store[si] = null;
    // Place on bench
    bench[emptyIdx] = cardId;
    set({
      resources: { ...state.resources, gold: state.resources.gold - effectiveCost },
      bench,
      cardPool: pool,
      cardStore: store,
    });
  },
  sellCard: ({ cardId, slotIndex }) => {
    const state = get();
    const bench = [...state.bench];
    let idx = typeof slotIndex === 'number' ? slotIndex : bench.indexOf(cardId);
    if (idx === -1) return;
    bench[idx] = null;
    // Return to pool
    const m = cardId.match(/^(card_.+?)_(I|II|III)$/);
    if (m) {
      const baseId = `${m[1]}_I`;
      const level = m[2];
      const multiplier = { I: 1, II: 3, III: 9 }[level] || 1;
      set({ cardPool: [...state.cardPool, ...Array(multiplier).fill(baseId)] });
    }
    // Refund
    const card = cardConfig.cards.find(c => c.id === cardId);
    const refund = card?.cost?.gold || 0;
    set({
      bench,
      resources: { ...state.resources, gold: state.resources.gold + refund },
    });
  },
}));
