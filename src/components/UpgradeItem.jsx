// src/components/UpgradeItem.jsx
import PropTypes from 'prop-types';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { playerResourcesState } from '../recoil/atoms/playerResourcesState';
import { benchState }           from '../recoil/atoms/benchState';
import {
  storeSizeState,
  storeRefreshCostState
} from '../recoil/atoms/storeState';
import { discountIState }       from '../recoil/atoms/shopState';
import { Stack, Text } from 'tamagui';

export default function UpgradeItem({ id, label, description, costGem, effect }) {
  const gems        = useRecoilValue(playerResourcesState).gem;
  const setResources = useSetRecoilState(playerResourcesState);

  const [bench, setBench]             = useRecoilState(benchState);
  const [storeSize, setStoreSize]     = useRecoilState(storeSizeState);
  const [discountI, setDiscountI]     = useRecoilState(discountIState);
  const [refreshCost, setRefreshCost] = useRecoilState(storeRefreshCostState);

  const handlePurchase = e => {
    e.preventDefault();
    if (e.type !== 'contextmenu') return;  // only right-click
    if (gems < costGem) {
      alert('Not enough gems!');
      return;
    }

    // 1) deduct gems
    setResources(r => ({ ...r, gem: r.gem - costGem }));

    // 2) apply effect
    switch (effect.type) {
      case 'benchSlot':
        // add one null slot to bench
        setBench(b => [...b, null]);
        break;

      case 'storeSlot':
        // increase number of cards shown
        setStoreSize(s => s + effect.delta);
        break;

      case 'discountI':
        // subtract delta from level-I cost later in purchase logic
        setDiscountI(d => d + effect.delta);
        break;

      case 'refreshCost':
        // lower the gold cost to refresh
        setRefreshCost(c => Math.max(0, c - effect.delta));
        break;

      default:
        console.warn('Unknown upgrade effect:', effect.type);
    }
  };

  return (
    <Stack
      className="upgrade-item"
      onContextMenu={handlePurchase}
      title="Right-click to purchase"
      borderWidth={2}
      borderColor="$accent8"
      borderRadius={18}
      padding={12}
      margin={8}
      backgroundColor="$background"
      opacity={gems >= costGem ? 1 : 0.5}
      cursor={gems >= costGem ? 'context-menu' : 'not-allowed'}
      shadowColor="$shadowColor"
      shadowRadius={8}
      fontFamily="'Silkscreen', monospace"
    >
      <Text fontWeight="bold" fontSize={20} color="$accent10">{label}</Text>
      <Text fontFamily="'Silkscreen', monospace" fontSize={16} color="$color12">{description}</Text>
      <Text fontFamily="'Silkscreen', monospace" fontSize={14} color="$color10">Cost: {costGem} 💎</Text>
    </Stack>
  );
}

UpgradeItem.propTypes = {
  id:          PropTypes.string.isRequired,
  label:       PropTypes.string.isRequired,
  description: PropTypes.string,
  costGem:     PropTypes.number.isRequired,
  effect:      PropTypes.shape({
    type:  PropTypes.oneOf(['benchSlot','storeSlot','discountI','refreshCost']).isRequired,
    delta: PropTypes.number.isRequired
  }).isRequired
};
