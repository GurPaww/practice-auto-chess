// src/pages/MainMenu.jsx
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil';
import { gameState } from '../recoil/atoms/gameState';
import { playerResourcesState } from '../recoil/atoms/playerResourcesState';
import { benchState } from '../recoil/atoms/benchState';
import { cardPoolState } from '../recoil/atoms/cardPoolState';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import { initialResourcesSelector } from '../recoil/selectors/resourceSelectors';

export default function MainMenu() {
  const navigate = useNavigate();
  const { round } = useRecoilValue(gameState);
  const initRes = useRecoilValue(initialResourcesSelector);
  const setResources = useSetRecoilState(playerResourcesState);

  const resetGame = useRecoilCallback(({ reset, set }) => () => {
    reset(gameState);
    reset(playerResourcesState);
    reset(benchState);
    reset(cardPoolState);
    reset(cardStoreState);
    set(playerResourcesState, initRes); // <-- set initial gold/gem
  }, [initRes]);

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
        <button onClick={() => navigate('/game')} style={{
          fontSize: 22,
          padding: '12px 36px',
          margin: '12px 0',
          borderRadius: 16,
          border: '2px solid #bfa',
          background: '#fff',
          color: '#2d5c3b',
          boxShadow: '0 2px 8px #bfa6',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s, box-shadow 0.2s'
        }}>
          Resume Game
        </button>
      )}

      <button
        onClick={() => {
          resetGame();
          navigate('/game');
        }}
        style={{
          fontSize: 22,
          padding: '12px 36px',
          margin: '12px 0',
          borderRadius: 16,
          border: '2px solid #bfa',
          background: '#fff',
          color: '#2d5c3b',
          boxShadow: '0 2px 8px #bfa6',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s, box-shadow 0.2s'
        }}
      >
        Start New Game
      </button>

      <button onClick={() => navigate('/shop')} style={{
        fontSize: 20,
        padding: '10px 28px',
        margin: '8px 0',
        borderRadius: 14,
        border: '2px solid #bfa',
        background: '#e0f7fa',
        color: '#2d5c3b',
        boxShadow: '0 1px 4px #bfa4',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s, box-shadow 0.2s'
      }}>
        Upgrade Shop
      </button>

      <button onClick={() => navigate('/cards')} style={{
        fontSize: 20,
        padding: '10px 28px',
        margin: '8px 0',
        borderRadius: 14,
        border: '2px solid #bfa',
        background: '#e0f7fa',
        color: '#2d5c3b',
        boxShadow: '0 1px 4px #bfa4',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s, box-shadow 0.2s'
      }}>
        Card Collection
      </button>
    </div>
  );
}
