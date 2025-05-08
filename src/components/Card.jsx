// src/components/Card.jsx
import PropTypes from 'prop-types';
import { useSetRecoilState } from 'recoil';
import cardConfig from '../data/cardConfig.json';
import { purchaseSelector } from '../recoil/selectors/purchaseSelector';
import { sellSelector }     from '../recoil/selectors/sellSelector';

export default function Card({ cardId, location }) {
  const doPurchase = useSetRecoilState(purchaseSelector);
  const doSell     = useSetRecoilState(sellSelector);

  if (!cardId) {
    return <div className="card empty" />;
  }

  const card = cardConfig.cards.find(c => c.id === cardId);
  if (!card) {
    return <div className="card empty" />;
  }

  const handleContextMenu = e => {
    e.preventDefault();
    if (location === 'store')  doPurchase(cardId);
    else if (location === 'bench') doSell(cardId);
  };

  const imgSrc = new URL(`../assets/${cardId}.png`, import.meta.url).href;

  return (
    <div className="card" onContextMenu={handleContextMenu}>
      <img src={imgSrc} alt={card.name} width={64} height={64} />
      <div className="card-info">
        <div>{card.name}</div>
        <div>Cost: {card.cost.gold}</div>
        <div>Score: {card.score}</div>
      </div>
    </div>
  );
}

Card.propTypes = {
  cardId:   PropTypes.string,
  location: PropTypes.oneOf(['store', 'bench']).isRequired,
};
