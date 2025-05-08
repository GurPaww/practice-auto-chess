// src/pages/MainMenu.jsx
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { gameState } from '../recoil/atoms/gameState';
import { playerResourcesState } from '../recoil/atoms/playerResourcesState';
import { benchState } from '../recoil/atoms/benchState';
import { cardPoolState } from '../recoil/atoms/cardPoolState';
import { cardStoreState } from '../recoil/atoms/cardStoreState';

export default function MainMenu() {
  const navigate = useNavigate();
  const { round } = useRecoilValue(gameState);

  const resetGame = useRecoilCallback(({ reset }) => () => {
    reset(gameState);
    reset(playerResourcesState);
    reset(benchState);
    reset(cardPoolState);
    reset(cardStoreState);
  }, []);

  return (
    <div className="main-menu">
      <h1>🔮 A Weird Card Game</h1>

      {round > 1 && (
        <button onClick={() => navigate('/game')}>
          Resume Game
        </button>
      )}

      <button
        onClick={() => {
          resetGame();
          navigate('/game');
        }}
      >
        Start New Game
      </button>

      <button onClick={() => navigate('/shop')}>
        Upgrade Shop
      </button>

      <button onClick={() => navigate('/cards')}>
        Card Collection
      </button>
    </div>
  );
}
