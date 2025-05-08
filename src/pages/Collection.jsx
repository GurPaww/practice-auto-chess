// src/pages/Collection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardConfig from '../data/cardConfig.json';
import Card from '../components/Card';

export default function Collection() {
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState(0);
  const [page, setPage] = useState(0);
  const levels = [1, 2, 3];

  const cards = cardConfig.cards.filter(c =>
    filterLevel === 0 ? true : c.level === filterLevel
  );

  // Book: 3 cards per page, 2 pages at once (6 cards per spread)
  const cardsPerPage = 3;
  const cardsPerSpread = 6;
  const pageCount = Math.ceil(cards.length / cardsPerSpread);
  const leftCards = cards.slice(page * cardsPerSpread, page * cardsPerSpread + cardsPerPage);
  const rightCards = cards.slice(page * cardsPerSpread + cardsPerPage, (page + 1) * cardsPerSpread);

  return (
    <div className="collection-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#f4f2e9' }}>
      <header style={{ width: '100%', maxWidth: 700, margin: '24px auto 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Card Collection</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="filters" style={{ margin: '16px 0' }}>
        <label>Filter by Level:</label>
        <select
          value={filterLevel}
          onChange={e => { setFilterLevel(Number(e.target.value)); setPage(0); }}
        >
          <option value={0}>All</option>
          {levels.map(lvl => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </div>

      <div className="book-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0', minHeight: 320 }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{ fontSize: 22, marginRight: 16 }}>
          ◀ Prev
        </button>
        <div className="book-boundary" style={{
          display: 'flex',
          background: 'linear-gradient(90deg, #f9f7ef 48%, #e7e3d1 52%)',
          border: '4px solid #bfa',
          borderRadius: 24,
          boxShadow: '0 4px 32px #bfa6',
          padding: '32px 36px',
          minWidth: 480,
          minHeight: 260,
          position: 'relative',
          gap: 48
        }}>
          <div className="book-page left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180 }}>
            {leftCards.map(card => (
              <Card
                key={card.id}
                cardId={card.id}
                location="collection"
                trait={card.traits?.race || 'Elemental'}
                background={card.traits?.background || 'Forest'}
              />
            ))}
          </div>
          <div className="book-spine" style={{ width: 6, background: '#bfa', borderRadius: 3, margin: '0 8px', boxShadow: '0 0 8px #bfa8' }} />
          <div className="book-page right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180 }}>
            {rightCards.map(card => (
              <Card
                key={card.id}
                cardId={card.id}
                location="collection"
                trait={card.traits?.race || 'Elemental'}
                background={card.traits?.background || 'Forest'}
              />
            ))}
          </div>
        </div>
        <button disabled={page === pageCount - 1 || pageCount === 0} onClick={() => setPage(page + 1)} style={{ fontSize: 22, marginLeft: 16 }}>
          Next ▶
        </button>
      </div>
      <div style={{textAlign: 'center', marginTop: 8}}>
        Page {page + 1} / {pageCount || 1}
      </div>
    </div>
  );
}
