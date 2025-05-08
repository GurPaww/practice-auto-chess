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
    <div
      className="upgrade-item"
      onContextMenu={handlePurchase}
      title="Right-click to purchase"
      style={{
        border: '1px solid #888',
        borderRadius: 6,
        padding: '0.5rem',
        margin: '0.5rem',
        cursor: gems >= costGem ? 'context-menu' : 'not-allowed',
        opacity: gems >= costGem ? 1 : 0.5
      }}
    >
      <h3>{label}</h3>
      <p>{description}</p>
      <small>Cost: {costGem} 💎</small>
    </div>
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
