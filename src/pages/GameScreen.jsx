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
import { cardPoolState } from '../recoil/atoms/cardPoolState';
import { storeRefreshCostState }         from '../recoil/atoms/storeState';
import { benchState } from '../recoil/atoms/benchState';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import { useResetGame } from '../utils/resetGame';

export default function GameScreen() {
  const navigate       = useNavigate();
  const { round }      = useRecoilValue(gameState);
  const score          = useRecoilValue(benchScoreSelector);
  const target         = useRecoilValue(targetScoreSelector);
  const resources      = useRecoilValue(playerResourcesState);
  const initRes        = useRecoilValue(initialResourcesSelector);
  const refreshStore   = useSetRecoilState(refreshStoreSelector);
  const goNext         = useSetRecoilState(nextRoundSelector);
  const isGameOver     = useRecoilValue(gameOverState);
  const setGameOver    = useSetRecoilState(gameOverState);
  const refreshCost = useRecoilValue(storeRefreshCostState);
  const setRefreshCost = useSetRecoilState(storeRefreshCostState);
  const resetGame = useResetGame(initRes);

  
  const handleRefresh = useCallback(() => {
    refreshStore();
  }, [refreshStore]);

  
  const handleNext = useCallback(() => {
    goNext();
    if (round % 3 == 0) {
      setRefreshCost(cost => cost + 1);
      console.log('cost increased to: ', refreshCost);
    }
    if (score < target) {
      setGameOver(true);
    }
  }, [goNext, score, target, setGameOver]);

  // keyboard shortcuts
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
        <div style={{ fontSize: 22, marginBottom: 32 }}>Better luck next time!<br/>You reached round <b>{round}</b> with score <b>{score}</b>.</div>
        <div className="game-over-buttons">
          <button className="button-main" onClick={() => { setGameOver(false); navigate('/'); }}>
            Back to Menu
          </button>
          <button
            className="button-secondary"
            onClick={() => {
              resetGame();
              refreshStore(false);
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
