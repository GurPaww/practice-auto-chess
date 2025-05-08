// src/recoil/atoms/playerResourcesState.js
import { atom } from 'recoil';

export const playerResourcesState = atom({
  key: 'playerResourcesState',
  default: {
    gold: 0,
    gem: 0,
    // add other resources here later (e.g. gem: 0)
  },
});
