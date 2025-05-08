// src/recoil/atoms/shopState.js
import { atom } from 'recoil';

export const discountIState = atom({
  key: 'discountIState',
  default: 0, // number of gold off level-I cards
});
