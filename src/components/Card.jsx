// src/components/Card.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import cardConfig from '../data/cardConfig.json';
import { purchaseSelector } from '../recoil/selectors/purchaseSelector';
import { sellSelector } from '../recoil/selectors/sellSelector';
import { discountIState } from '../recoil/atoms/shopState';
// NOTE: Requires Tamagui installed and ThemeProvider set up in your app.
import { Stack, Text } from 'tamagui';

export default function Card({ cardId, location, trait, background, showHoverOn, slotIndex, highlighted, onBenchClick, draggable, onDragStart, onDragOver, onDrop, isDragging }) {
  const doPurchase = useSetRecoilState(purchaseSelector);
  const doSell = useSetRecoilState(sellSelector);
  const discountI = useRecoilValue(discountIState);
  const [hovered, setHovered] = useState(false);

  if (!cardId) {
    return <Stack className="card empty" />;
  }

  const card = cardConfig.cards.find(c => c.id === cardId);
  if (!card) {
    return <Stack className="card empty" />;
  }

  const handleContextMenu = e => {
    e.preventDefault();
    if (location === 'store') doPurchase({ cardId, slotIndex });
    else if (location === 'bench') doSell({ cardId, slotIndex });
  };

  const imgSrc = new URL(`../assets/${cardId}.png`, import.meta.url).href;

  // Calculate effective cost (discount applies to all levels)
  let effectiveCost;
  if (card.level === 1) {
    effectiveCost = Math.max(1, card.cost.gold - discountI);
  } else if (card.level === 2) {
    effectiveCost = Math.max(1, card.cost.gold - 2 * discountI);
  } else if (card.level === 3) {
    effectiveCost = Math.max(1, card.cost.gold - 4 * discountI);
  } else {
    effectiveCost = card.cost.gold;
  }

  return (
    <Stack
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
      borderRadius={12}
      backgroundColor={location === 'collection' ? '#f8fff8' : '#fff'}
      borderWidth={highlighted ? 3 : 2}
      borderColor={highlighted ? 'orange' : (location === 'collection' ? '#bfa' : '#aaa')}
      shadowRadius={hovered && location === 'collection' ? 12 : 4}
      margin={8}
      width={120}
      height={160}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      opacity={isDragging ? 0.5 : 1}
      position="relative"
      boxSizing="border-box"
      style={{ transition: 'box-shadow 0.2s, border 0.2s' }}
    >
      <img src={imgSrc} alt={card.name} width={64} height={64} style={{ marginBottom: 4 }} />
      <Stack className="card-info" alignItems="center">
        <Text fontFamily="'Silkscreen', monospace">{card.name}</Text>
        <Text fontFamily="'Silkscreen', monospace">Cost: {effectiveCost}</Text>
        <Text fontFamily="'Silkscreen', monospace">Score: {card.score}</Text>
      </Stack>
      {hovered && location === 'collection' && (
        <Stack
          position="absolute"
          top="100%"
          left="50%"
          transform="translateX(-50%)"
          backgroundColor="#fffbe8"
          borderWidth={1}
          borderColor="#ccc"
          borderRadius={8}
          padding={8}
          marginTop={6}
          minWidth={120}
          zIndex={10}
          shadowRadius={8}
          style={{ boxShadow: '0 2px 8px #bbb', color: '#333', fontSize: 13 }}
        >
          <Text><b>Trait:</b> {trait}</Text>
          <Text><b>Background:</b> {background}</Text>
        </Stack>
      )}
    </Stack>
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
