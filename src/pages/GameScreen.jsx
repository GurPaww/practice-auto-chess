// src/pages/GameScreen.jsx
import { useEffect, useCallback, useRef } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil';
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
  const didInit = useRef(false);

  const resetGame = useRecoilCallback(({ reset, set }) => () => {
    reset(gameState);
    reset(playerResourcesState);
    reset(cardPoolState);
    reset(cardStoreState);
    set(playerResourcesState, initRes); // set initial gold/gem after reset
    // add others if needed
  }, [initRes]);

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
      <div className="game-over-overlay" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(240,255,240,0.96)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        color: '#2d5c3b',
        border: '8px solid #bfa',
        borderRadius: 32,
        boxShadow: '0 8px 32px #bfa8',
        padding: 48
      }}>
        <h2 style={{ fontSize: 48, marginBottom: 16, textShadow: '2px 2px 0 #bfa' }}>Game Over</h2>
        <div style={{ fontSize: 22, marginBottom: 32 }}>Better luck next time!<br/>You reached round <b>{round}</b> with score <b>{score}</b>.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <button onClick={() => { setGameOver(false); navigate('/'); }} style={{
            fontSize: 22,
            padding: '12px 36px',
            borderRadius: 16,
            border: '2px solid #bfa',
            background: '#fff',
            color: '#2d5c3b',
            boxShadow: '0 2px 8px #bfa6',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: 8
          }}>
            Back to Menu
          </button>
          <button
            onClick={async () => {
              setGameOver(false);
              await resetGame();
              navigate('/game');
            }}
            style={{
              fontSize: 22,
              padding: '12px 36px',
              borderRadius: 16,
              border: '2px solid #bfa',
              background: '#e0f7fa',
              color: '#2d5c3b',
              boxShadow: '0 2px 8px #bfa6',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginLeft: 8
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
    <div className="game-screen" style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f4f2e9 0%, #e0f7fa 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Comic Sans MS, Comic Sans, cursive',
      color: '#2d5c3b'
    }}>
      <header className="top-bar" style={{
        width: '100%',
        maxWidth: 900,
        margin: '24px auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#e0f7fa',
        borderRadius: 16,
        padding: '12px 32px',
        boxShadow: '0 2px 8px #bfa6',
        fontWeight: 'bold',
        fontSize: 20
      }}>
        <button className="next-btn" onClick={handleNext} style={{
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 10,
          border: '2px solid #bfa',
          background: '#fff',
          color: '#2d5c3b',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: 8
        }}>▶ Next Round</button>
        <button className="refresh-btn" onClick={handleRefresh} style={{
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 10,
          border: '2px solid #bfa',
          background: '#fff',
          color: '#2d5c3b',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: 8
        }}>⟳ Refresh</button>
        <div className="refresh-cost" style={{ gridArea: 'header', textAlign: 'center', color: '#388e3c', fontWeight: 'bold' }}>
          Refresh costs: {refreshCost} gold
        </div>
        <button className="shop-btn" onClick={() => navigate('/shop')} style={{
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 10,
          border: '2px solid #bfa',
          background: '#e0f7fa',
          color: '#2d5c3b',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginLeft: 8
        }}>🛒 Shop</button>
      </header>
      <div className="score-display" style={{
        margin: '24px 0 12px 0',
        fontSize: 22,
        fontWeight: 'bold',
        background: '#fff',
        borderRadius: 12,
        padding: '12px 32px',
        boxShadow: '0 1px 4px #bfa4',
        color: '#2d5c3b',
        textAlign: 'center',
        minWidth: 260
      }}>
        Score: {score} / {target}
        <br />
        Round: {round}
      </div>
      <div className="store-area" style={{ margin: '12px 0' }}>
        <Store />
      </div>
      <div className="bench-area" style={{ margin: '12px 0' }}>
        <Bench />
      </div>
      <aside className="info-panel" style={{
        position: 'absolute',
        right: 32,
        top: 120,
        background: '#e0f7fa',
        borderRadius: 16,
        padding: '18px 24px',
        boxShadow: '0 2px 8px #bfa6',
        color: '#2d5c3b',
        fontWeight: 'bold',
        fontSize: 18,
        minWidth: 160
      }}>
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
