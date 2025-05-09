// src/pages/MainMenu.jsx
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameState } from '../recoil/atoms/gameState';
import { initialResourcesSelector } from '../recoil/selectors/resourceSelectors';
import { refreshStoreSelector } from '../recoil/selectors/storeSelectors';
import { useResetGame } from '../utils/resetGame';

export default function MainMenu() {
  const navigate = useNavigate();
  const { round } = useRecoilValue(gameState);
  const initRes = useRecoilValue(initialResourcesSelector);
  const refreshStore = useSetRecoilState(refreshStoreSelector);
  const resetGame = useResetGame(initRes);

  return (
    <div className="main-menu" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fff8 0%, #e0f7fa 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Comic Sans MS, Comic Sans, cursive',
      color: '#2d5c3b'
    }}>
      <h1 style={{ fontSize: 48, marginBottom: 24, letterSpacing: 2, textShadow: '2px 2px 0 #bfa' }}>🔮 A Weird Card Game</h1>

      {round > 1 && (
        <button onClick={() => navigate('/game')} className="button-main">
          Resume Game
        </button>
      )}

      <button
        onClick={() => {
          resetGame();
          refreshStore(false)
          navigate('/game');
        }}
        className="button-main"
      >
        Start New Game
      </button>

      <button onClick={() => navigate('/shop')} className="button-shop">
        Upgrade Shop
      </button>

      <button onClick={() => navigate('/cards')} className="button-collection">
        Card Collection
      </button>
    </div>
  );
}
