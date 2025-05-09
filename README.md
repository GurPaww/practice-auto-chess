# Round-Based Merge Game Demo

## Overview

This is a demo version of a round-based, merge-style game built with React, Vite, and Zustand.  
Players buy cards from a rotating shop, place them on a bench, merge three of a kind to level up, earn gems, and aim to reach a target score each round.

---

## Installation

1. **Clone the repo**  
   ```bash
   git clone <your-repo-url>
   cd round-based-merge-game
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start development server**  
   ```bash
   npm run dev
   ```

4. **Build for production**  
   ```bash
   npm run build
   ```

---

## Project Structure

```
round-based-merge-game/
├── src/
│   ├── assets/                 # Card and UI images
│   ├── components/             # Reusable React components (Card, Store, Bench, etc.)
│   ├── data/
│   │   └── cardConfig.json     # All card definitions and game settings
│   ├── pages/                  # Route pages (MainMenu, GameScreen, UpgradeShop, Collection)
│   ├── zustand/                # Zustand store for all global state
│   ├── recoil/                 # (Obsolete) Recoil atoms/selectors (can be deleted)
│   ├── App.jsx                 # Main router setup
│   └── main.jsx                # Entry point
├── index.css                   # Global styles and layout grid
├── README.md                   # This file
├── vite.config.js              # Vite configuration
```

---

## State Management

**Zustand** is now used for all global state. The old `src/recoil/` folder is obsolete and can be deleted.
- All state and actions are in `src/zustand/useGameStore.js`.
- Use the `useGameStore` hook in your components to access and update state.

---

## How to Play

1. **Start a new game** from the Main Menu.  
2. Each round, you receive **gold** (10 + 2 × round number) to spend in the shop.  
3. **Shop**: displays *N* random level‑I cards (default **5**).  
   - **Right‑click** a card to purchase (cost = gold).  
   - If insufficient gold, the gold counter flashes red and enlarges.  
4. **Bench**: has *M* slots (default **8**). Place purchased cards here.  
   - **Right‑click** a bench card to sell at full cost — returns cards to the pool and refunds gold.  
   - Selling level‑II returns 3 level‑I copies; selling level‑III returns 9.  
5. **Merging**: three of the same level‑I auto‑merge into level‑II (award 1 gem), and three level‑II auto‑merge into level‑III (award 1 gem).  
6. **Next Round**: click to advance if your bench score ≥ target score.  
   - Score = sum of individual card scores (varies by type & level).  
   - If you meet the target, you proceed (gain gold); otherwise, game over.  
7. **Upgrade Shop**: spend gems to increase shop size, bench slots, discounts, and more.  
8. **Collection**: view all cards and filter by level, tier, and lore details.  

---

## Configuration

All card data and game parameters (pool size, shop slots, bench slots, merge rules) live in:  
`src/data/cardConfig.json`

Modify values there and the UI will update dynamically.

---

## Migration Note

- As of May 2025, **Zustand** is used for all state management. The `src/recoil/` folder and all Recoil logic are obsolete and can be deleted.
- If you are upgrading from an older version, update your code to use `useGameStore` from `src/zustand/useGameStore.js` for all state and actions.

Enjoy the demo!
