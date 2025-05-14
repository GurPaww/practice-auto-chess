// src/pages/Collection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardConfig from '../data/cardConfig.json';
import Card from '../components/Card';
import { Stack, Button } from 'tamagui';

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
    <Stack className="collection-page" flexDirection="column" alignItems="center" minHeight="100vh" backgroundColor="$background">
      <Stack className="collection-header" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%" maxWidth={700} marginVertical={24}>
        <Button
          backgroundColor="$color1"
          color="$color12"
          borderRadius={18}
          fontFamily="'Silkscreen', monospace"
          fontSize={22}
          paddingVertical={12}
          paddingHorizontal={32}
          onPress={() => navigate(-1)}
        >
          ← Back
        </Button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Card Collection</h2>
        <div style={{ width: 60 }} />
      </Stack>
      <Stack className="filters" flexDirection="row" alignItems="center" marginVertical={16}>
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
      </Stack>
      <Stack className="book-view" flexDirection="row" alignItems="center" justifyContent="center" marginVertical={32} minHeight={320}>
        <Button
          backgroundColor="$color1"
          color="$color12"
          borderRadius={18}
          fontFamily="'Silkscreen', monospace"
          fontSize={22}
          paddingVertical={12}
          paddingHorizontal={32}
          disabled={page === 0}
          onPress={() => setPage(page - 1)}
          style={{ marginRight: 16 }}
        >
          ◀ Prev
        </Button>
        <Stack className="book-boundary" flexDirection="row" backgroundColor="$background" borderWidth={4} borderColor="$color3" borderRadius={24} boxShadow="0 4px 32px $shadowColor" padding={36} minWidth={480} minHeight={260} gap={48}>
          <Stack className="book-page left" flexDirection="column" alignItems="center" minWidth={180}>
            {leftCards.map(card => (
              <Card
                key={card.id}
                cardId={card.id}
                location="collection"
                trait={card.traits?.race || 'Elemental'}
                background={card.traits?.background || 'Forest'}
              />
            ))}
          </Stack>
          <div className="book-spine" />
          <Stack className="book-page right" flexDirection="column" alignItems="center" minWidth={180}>
            {rightCards.map(card => (
              <Card
                key={card.id}
                cardId={card.id}
                location="collection"
                trait={card.traits?.race || 'Elemental'}
                background={card.traits?.background || 'Forest'}
              />
            ))}
          </Stack>
        </Stack>
        <Button
          backgroundColor="$color1"
          color="$color12"
          borderRadius={18}
          fontFamily="'Silkscreen', monospace"
          fontSize={22}
          paddingVertical={12}
          paddingHorizontal={32}
          disabled={page === pageCount - 1 || pageCount === 0}
          onPress={() => setPage(page + 1)}
          style={{ marginLeft: 16 }}
        >
          Next ▶
        </Button>
      </Stack>
      <div style={{textAlign: 'center', marginTop: 8}}>
        Page {page + 1} / {pageCount || 1}
      </div>
    </Stack>
  );
}
