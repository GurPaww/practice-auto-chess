// src/pages/Collection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardConfig from '../data/cardConfig.json';

export default function Collection() {
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState(0);
  const levels = [1, 2, 3];

  const cards = cardConfig.cards.filter(c =>
    filterLevel === 0 ? true : c.level === filterLevel
  );

  return (
    <div className="collection-page">
      <header>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Card Collection</h2>
      </header>

      <div className="filters">
        <label>Filter by Level:</label>
        <select
          value={filterLevel}
          onChange={e => setFilterLevel(Number(e.target.value))}
        >
          <option value={0}>All</option>
          {levels.map(lvl => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </div>

      <div className="card-grid">
        {cards.map(card => {
          const imgSrc = new URL(`../assets/${card.id}.png`, import.meta.url).href;
          return (
            <div key={card.id} className="collection-card">
              <img src={imgSrc} alt={card.name} width={64} height={64} />
              <div>{card.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
