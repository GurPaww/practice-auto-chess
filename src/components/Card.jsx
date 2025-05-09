// src/components/Card.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import cardConfig from '../data/cardConfig.json';
import { purchaseSelector } from '../recoil/selectors/purchaseSelector';
import { sellSelector } from '../recoil/selectors/sellSelector';
import { discountIState } from '../recoil/atoms/shopState';

export default function Card({ cardId, location, trait, background, showHoverOn }) {
  const doPurchase = useSetRecoilState(purchaseSelector);
  const doSell = useSetRecoilState(sellSelector);
  const discountI = useRecoilValue(discountIState);
  const [hovered, setHovered] = useState(false);

  if (!cardId) {
    return <div className="card empty" />;
  }

  const card = cardConfig.cards.find(c => c.id === cardId);
  if (!card) {
    return <div className="card empty" />;
  }

  const handleContextMenu = e => {
    e.preventDefault();
    if (location === 'store') doPurchase(cardId);
    else if (location === 'bench') doSell(cardId);
  };

  const imgSrc = new URL(`../assets/${cardId}.png`, import.meta.url).href;

  // Calculate effective cost (for level 1 cards only)
  const effectiveCost = card.level === 1 ? Math.max(1, card.cost.gold - discountI) : card.cost.gold;

  return (
    <div
      className={`card${hovered ? ' hovered' : ''} card-collection-boundary`}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => showHoverOn === 'hover' && setHovered(true)}
      onMouseLeave={() => showHoverOn === 'hover' && setHovered(false)}
      onClick={() => showHoverOn === 'click' && setHovered(h => !h)}
      // To adjust card boundary size, change width/height below:
      style={{ position: 'relative', boxSizing: 'border-box', border: location === 'collection' ? '2px dashed #bfa' : '2px solid #aaa', borderRadius: 12, 
        background: location === 'collection' ? '#f8fff8' : '#fff', 
        boxShadow: hovered && location === 'collection' ? '0 0 12px #bfa' : '0 1px 4px #ccc', 
        margin: 8, width: 100, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s, border 0.2s' }}
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
};

Card.defaultProps = {
  showHoverOn: 'hover',
};
