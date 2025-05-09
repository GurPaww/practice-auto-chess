// src/components/UpgradeItem.jsx
import PropTypes from 'prop-types';
import { useGameStore } from '../zustand/useGameStore';

export default function UpgradeItem({ id, label, description, costGem, effect }) {
  const gems = useGameStore(s => s.resources.gem);
  const setResources = useGameStore(s => s.setResources);
  const bench = useGameStore(s => s.bench);
  const setBench = useGameStore(s => s.setBench);
  const storeSize = useGameStore(s => s.storeSize);
  const setStoreSize = useGameStore(s => s.setStoreSize);
  const discountI = useGameStore(s => s.discountI);
  const setDiscountI = useGameStore(s => s.setDiscountI);
  const refreshCost = useGameStore(s => s.refreshCost);
  const setRefreshCost = useGameStore(s => s.setRefreshCost);

  const handlePurchase = e => {
    e.preventDefault();
    if (e.type !== 'contextmenu') return;  // only right-click
    if (gems < costGem) {
      alert('Not enough gems!');
      return;
    }
    setResources(r => ({ ...r, gem: r.gem - costGem }));
    switch (effect.type) {
      case 'benchSlot':
        setBench([...bench, null]);
        break;
      case 'storeSlot':
        setStoreSize(storeSize + effect.delta);
        break;
      case 'discountI':
        setDiscountI(discountI + effect.delta);
        break;
      case 'refreshCost':
        setRefreshCost(Math.max(0, refreshCost - effect.delta));
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
