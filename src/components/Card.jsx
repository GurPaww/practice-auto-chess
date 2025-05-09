// src/components/Card.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useGameStore } from '../zustand/useGameStore';
import cardConfig from '../data/cardConfig.json';

export default function Card({ cardId, location, trait, background, showHoverOn, slotIndex, highlighted, onBenchClick, draggable, onDragStart, onDragOver, onDrop, isDragging }) {
  const setBench = useGameStore(state => state.setBench);
  const setCardStore = useGameStore(state => state.setCardStore);
  const setCardPool = useGameStore(state => state.setCardPool);
  const setResources = useGameStore(state => state.setResources);
  const discountI = useGameStore(state => state.discountI);
  const resources = useGameStore(state => state.resources);
  const bench = useGameStore(state => state.bench);
  const cardStore = useGameStore(state => state.cardStore);
  const cardPool = useGameStore(state => state.cardPool);

  const [hovered, setHovered] = useState(false);

  if (!cardId) {
    return <div className="card empty" />;
  }

  const card = cardConfig.cards.find(c => c.id === cardId);
  if (!card) {
    return <div className="card empty" />;
  }

  // Purchase logic (store)
  const handlePurchase = () => {
    const cardInStore = cardStore.find(c => c.id === cardId);
    const cardInPool = cardPool.find(c => c.id === cardId);

    // If the card is not already in the store or pool
    if (!cardInStore && !cardInPool) {
      // Check if the player has enough resources to purchase the card
      if (resources.gold >= card.cost.gold) {
        // Deduct the cost from the player's resources
        setResources(prev => ({ ...prev, gold: prev.gold - card.cost.gold }));

        // Add the card to the player's card store
        setCardStore(prev => [...prev, { ...card, level: 1 }]);

        // Optionally, add the card to a pool or bench
        setCardPool(prev => [...prev, { ...card, level: 1 }]);
      } else {
        console.log('Not enough resources to purchase the card');
      }
    }
  };

  // Sell logic (bench)
  const handleSell = () => {
    const cardInBench = bench.find(c => c.id === cardId);

    // If the card is in the bench
    if (cardInBench) {
      // Remove the card from the bench
      setBench(prev => prev.filter(c => c.id !== cardId));

      // Refund half of the card's cost to the player
      setResources(prev => ({ ...prev, gold: prev.gold + Math.floor(card.cost.gold / 2) }));
    }
  };

  const handleContextMenu = e => {
    e.preventDefault();
    if (location === 'store') handlePurchase();
    else if (location === 'bench') handleSell();
  };

  const imgSrc = new URL(`../assets/${cardId}.png`, import.meta.url).href;

  // Calculate effective cost (for level 1 cards only)
  const effectiveCost = card.level === 1 ? Math.max(1, card.cost.gold - discountI) : card.cost.gold;

  return (
    <div
      className={`card${hovered ? ' hovered' : ''}${highlighted ? ' highlighted' : ''} card-collection-boundary`}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => showHoverOn === 'hover' && setHovered(true)}
      onMouseLeave={() => showHoverOn === 'hover' && setHovered(false)}
      onClick={() => {
        if (location === 'bench' && onBenchClick) onBenchClick(slotIndex);
        else if (showHoverOn === 'click') setHovered(h => !h);
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        border: highlighted ? '3px solid orange' : (location === 'collection' ? '2px dashed #bfa' : '2px solid #aaa'),
        borderRadius: 12,
        background: location === 'collection' ? '#f8fff8' : '#fff',
        boxShadow: hovered && location === 'collection' ? '0 0 12px #bfa' : '0 1px 4px #ccc',
        margin: 8, width: 100, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s, border 0.2s',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <img src={imgSrc} alt={card.name} width={64} height={64} style={{ marginBottom: 4 }} />
      <div className="card-info" style={{ textAlign: 'center', fontSize: 14 }}>
        <div>{card.name}</div>
        <div>Cost: {effectiveCost}</div>
        <div>Score: {card.score}</div>
      </div>
      {hovered && location === 'collection' && (
        <div className="card-hover-details" style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fffbe8',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 8,
          marginTop: 6,
          minWidth: 120,
          zIndex: 10,
          boxShadow: '0 2px 8px #bbb',
          color: '#333',
          fontSize: 13
        }}>
          <div><b>Trait:</b> {trait}</div>
          <div><b>Background:</b> {background}</div>
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  cardId: PropTypes.string,
  location: PropTypes.oneOf(['store', 'bench', 'collection']).isRequired,
  trait: PropTypes.string,
  background: PropTypes.string,
  showHoverOn: PropTypes.oneOf(['hover', 'click']), // 'hover' (default) or 'click'
  slotIndex: PropTypes.number,
  highlighted: PropTypes.bool,
  onBenchClick: PropTypes.func,
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  isDragging: PropTypes.bool,
};

Card.defaultProps = {
  showHoverOn: 'hover',
};
