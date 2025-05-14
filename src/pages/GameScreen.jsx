// src/pages/GameScreen.jsx
import { useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Stack, Button } from 'tamagui';

import Store from '../components/Store';
import Bench from '../components/Bench';

import { benchScoreSelector, targetScoreSelector } from '../recoil/selectors/scoreSelectors';
import { nextRoundSelector }        from '../recoil/selectors/gameSelectors';
import { playerResourcesState }     from '../recoil/atoms/playerResourcesState';
import { initialResourcesSelector } from '../recoil/selectors/resourceSelectors';
import { refreshStoreSelector }     from '../recoil/selectors/storeSelectors';
import { gameOverState, gameState } from '../recoil/atoms/gameState';
import { storeRefreshCostState }         from '../recoil/atoms/storeState';
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
      <Stack className="game-over-overlay" position="fixed" top={0} left={0} right={0} bottom={0} backgroundColor="$background" alignItems="center" justifyContent="center" zIndex={1000} borderWidth={8} borderColor="$color3" borderRadius={32} shadowColor="$shadowColor" shadowRadius={32} padding={48}>
        <h2>Game Over</h2>
        <div style={{ fontSize: 22, marginBottom: 32 }}>Better luck next time!<br/>You reached round <b>{round}</b> with score <b>{score}</b>.</div>
        <Stack className="game-over-buttons" flexDirection="row" gap={24}>
          {/* <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={() => { setGameOver(false); navigate('/'); }}> */}
          <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={() => { setGameOver(false); navigate('/'); }}>
            Back to Menu
          </Button>
          <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={() => {
            resetGame();
            refreshStore(false);
            setGameOver(false);
          }}>
            Restart
          </Button>
        </Stack>
      </Stack>
    );
  }

  const playerIcon = new URL('../assets/player_icon.png', import.meta.url).href;

  return (
    <Stack className="game-screen" backgroundColor="$background">
      <Stack className="top-bar" flexDirection="row" gap={8} padding={16} alignItems="center" backgroundColor="$background">
        <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={handleNext}>
          ▶ Next Round
        </Button>
        <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={handleRefresh}>
          ⟳ Refresh
        </Button>
        <div className="refresh-cost" style={{ gridArea: 'header', textAlign: 'center', color: '#388e3c', fontWeight: 'bold' }}>
          Refresh costs: {refreshCost} gold
        </div>
        <Button className="pixel-btn" fontFamily="'Silkscreen', monospace" onPress={() => navigate('/shop')}>
          🛒 Shop
        </Button>
      </Stack>
      <div className="score-display">
        Score: {score} / {target}
        <br />
        Round: {round}
      </div>
      <Stack className="store-area">
        <Store />
      </Stack>
      <Stack className="bench-area">
        <Bench />
      </Stack>
      <Stack className="info-panel" padding={16}>
        <div className="player-info" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <img src={playerIcon} alt="Player Icon" width={32} height={32} style={{ marginRight: 8 }} />
          <span>Player1</span>
        </div>
        <div id="gold-display">Gold: {resources.gold}</div>
        <div>Gems: {resources.gem}</div>
      </Stack>
    </Stack>
  );
}
