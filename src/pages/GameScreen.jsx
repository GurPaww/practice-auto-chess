// src/pages/GameScreen.jsx
import { useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

import Store from '../components/Store';
import Bench from '../components/Bench';

import { benchScoreSelector, targetScoreSelector } from '../recoil/selectors/scoreSelectors';
import { nextRoundSelector }        from '../recoil/selectors/gameSelectors';
import { playerResourcesState }     from '../recoil/atoms/playerResourcesState';
import { initialResourcesSelector } from '../recoil/selectors/resourceSelectors';
import { refreshStoreSelector }     from '../recoil/selectors/storeSelectors';
import { gameOverState, gameState } from '../recoil/atoms/gameState';
import { cardPoolState, initialPool } from '../recoil/atoms/cardPoolState';
import { storeRefreshCostState }         from '../recoil/atoms/storeState';

export default function GameScreen() {
  const navigate       = useNavigate();
  const { round }      = useRecoilValue(gameState);
  const score          = useRecoilValue(benchScoreSelector);
  const target         = useRecoilValue(targetScoreSelector);
  const resources      = useRecoilValue(playerResourcesState);
  const initRes        = useRecoilValue(initialResourcesSelector);
  const setResources   = useSetRecoilState(playerResourcesState);
  const refreshStore   = useSetRecoilState(refreshStoreSelector);
  const goNext         = useSetRecoilState(nextRoundSelector);
  const isGameOver     = useRecoilValue(gameOverState);
  const setGameOver    = useSetRecoilState(gameOverState);
  const setPool        = useSetRecoilState(cardPoolState);
  const refreshCost = useRecoilValue(storeRefreshCostState);

  // only initialize on round 1 once
  useEffect(() => {
    console.log('GameScreen mount on round 1 → init resources & pool & store');
    setResources(initRes);
    setPool(initialPool);
    refreshStore(false);
  }, []);

  // keyboard shortcuts
  const handleRefresh = useCallback(() => {
    // console.log('🔄 Key/Click Refresh');
    refreshStore();
  }, [refreshStore]);

  const handleNext = useCallback(() => {
    // console.log('▶️ Key/Click Next Round');
    goNext();
    if (score < target) {
      // console.log('💀 Game Over triggered');
      setGameOver(true);
    }
  }, [goNext, score, target, setGameOver]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'r' || e.key === 'R' || e.key === 'd' || e.key === 'D') handleRefresh();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRefresh, handleNext]);

  if (isGameOver) {
    return (
      <div className="game-over-overlay">
        <h2>Game Over</h2>
        <button onClick={() => { setGameOver(false); navigate('/'); }}>
          Back to Menu
        </button>
        <button onClick={() => { setGameOver(false); navigate('/'); }}>
          Restart
        </button>
      </div>
    );
  }

  const playerIcon = new URL('../assets/player_icon.png', import.meta.url).href;

  return (
    <div className="game-screen">
      <header className="top-bar">
        <button className="next-btn" onClick={handleNext}>▶ Next Round</button>
        <button className="refresh-btn" onClick={handleRefresh}>⟳ Refresh</button>
        <div className="refresh-cost" style={{ gridArea: 'header', textAlign: 'center' }}>
          Refresh costs: {refreshCost} gold
        </div>
        <button className="shop-btn" onClick={() => navigate('/shop')}>🛒 Shop</button>
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
        <div className="player-info">
          <img src={playerIcon} alt="Player Icon" width={32} height={32} />
          <span>Player1</span>
        </div>
        <div id="gold-display">Gold: {resources.gold}</div>
        <div>Gems: {resources.gem}</div>
      </aside>
    </div>
  );
}
