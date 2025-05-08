// // src/recoil/selectors/mergeSelector.js
// import { selector } from 'recoil';
// import { benchState }           from '../atoms/benchState';
// import { playerResourcesState } from '../atoms/playerResourcesState';

// export const mergeSelector = selector({
//   key: 'mergeSelector',

//   get: ({ get }) => get(benchState),

//   set: ({ get, set }) => {
//     let bench = [...get(benchState)];
//     console.log('🔀 mergeSelector → before:', bench);

//     let gemReward = 0;
//     // Group slots by base ID (strip _I/_II/_III)
//     const groups = bench.reduce((acc, cid) => {
//       if (!cid) return acc;
//       const base = cid.replace(/_(I|II|III)$/, '');
//       acc[base] = acc[base] || [];
//       acc[base].push(cid);
//       return acc;
//     }, {});

//     // For each group, if 3+ copies, merge one and award a gem
//     Object.entries(groups).forEach(([base, ids]) => {
//       if (ids.length >= 3) {
//         // determine current level from the suffix
//         const suffix = ids[0].match(/_(I|II|III)$/)[1];
//         const level  = suffix === 'I' ? 1 : suffix === 'II' ? 2 : 3;
//         if (level < 3) {
//           const nextSuffix = ['I','II','III'][level];
//           const newId = `card_${base}_${nextSuffix}`;

//           // remove exactly 3 from bench
//           let removed = 0;
//           bench = bench.map(cid => {
//             if (cid && removed < 3 && cid.startsWith(`card_${base}_`)) {
//               removed++;
//               return null;
//             }
//             return cid;
//           });

//           // place the merged card in first empty slot
//           const slot = bench.indexOf(null);
//           if (slot >= 0) bench[slot] = newId;

//           gemReward++;
//           console.log(`🔀 mergeSelector → merged ${base} to level ${level+1}`);
//         }
//       }
//     });

//     // commit bench and award gems
//     set(benchState, bench);
//     console.log('🔀 mergeSelector → after:', bench, 'gems:', gemReward);

//     const res = get(playerResourcesState);
//     set(playerResourcesState, {
//       ...res,
//       gem: res.gem + gemReward,
//     });
//   }
// });
