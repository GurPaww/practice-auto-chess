// src/pages/GameScreen.jsx
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Store from '../components/Store';
import Bench from '../components/Bench';
import { useGameStore } from '../zustand/useGameStore';

export default function GameScreen() {
  const navigate = useNavigate();
  const round = useGameStore(s => s.round);
  const score = useGameStore(s => s.benchScore());
  const target = useGameStore(s => s.targetScore());
  const isGameOver = useGameStore(s => s.gameOver);
  const setGameOver = useGameStore(s => s.setGameOver);
  const handleRefresh = useGameStore(s => s.handleRefresh);
  const handleNext = useGameStore(s => s.handleNext);
  const resetGame = useGameStore(s => s.resetGame);
  const refreshCost = useGameStore(s => s.refreshCost);
  const resources = useGameStore(s => s.resources)

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'r' || e.key === 'R' || e.key === 'd' || e.key === 'D') handleRefresh();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRefresh]);

  if (isGameOver) {
    return (
      <div className="game-over-overlay">
        <h2>Game Over</h2>
        <div style={{ fontSize: 22, marginBottom: 32 }}>Better luck next time!<br/>You reached round <b>{round}</b> with score <b>{score}</b>.</div>
        <div className="game-over-buttons">
          <button className="button-main" onClick={() => { setGameOver(false); navigate('/'); }}>
            Back to Menu
          </button>
          <button
            className="button-secondary"
            onClick={() => {
              resetGame();
              handleRefresh(false);
              setGameOver(false);
            }}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  const playerIcon = new URL('../assets/player_icon.png', import.meta.url).href;

  return (
    <div className="game-screen">
      <header className="top-bar">
        <button className="button-main next-btn" onClick={handleNext}>▶ Next Round</button>
        <button className="button-main refresh-btn" onClick={handleRefresh}>⟳ Refresh</button>
        <div className="refresh-cost" style={{ gridArea: 'header', textAlign: 'center', color: '#388e3c', fontWeight: 'bold' }}>
          Refresh costs: {refreshCost} gold
        </div>
        <button className="button-shop shop-btn" onClick={() => navigate('/shop')}>🛒 Shop</button>
      </header>
      <div className="score-display">
        Score: {score} / {target}
        <br />
        Round: {round}
      </div>
      <div className="store-area">
        <Store />
      </div>
      <div className="bench-area">
        <Bench />
      </div>
      <aside className="info-panel">
        <div className="player-info" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <img src={playerIcon} alt="Player Icon" width={32} height={32} style={{ marginRight: 8 }} />
          <span>Player1</span>
        </div>
        <div id="gold-display">Gold: {resources.gold}</div>
        <div>Gems: {resources.gem}</div>
      </aside>
    </div>
  );
}
