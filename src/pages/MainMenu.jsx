// src/pages/MainMenu.jsx
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameState } from '../recoil/atoms/gameState';
import { initialResourcesSelector } from '../recoil/selectors/resourceSelectors';
import { refreshStoreSelector } from '../recoil/selectors/storeSelectors';
import { useResetGame } from '../utils/resetGame';
import { Stack, Text, Button } from 'tamagui';

export default function MainMenu() {
  const navigate = useNavigate();
  const { round } = useRecoilValue(gameState);
  const initRes = useRecoilValue(initialResourcesSelector);
  const refreshStore = useSetRecoilState(refreshStoreSelector);
  const resetGame = useResetGame(initRes);

  return (
    <Stack
      className="main-menu"
      minHeight="100vh"
      backgroundColor="$background"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={32}
      $sm={{ padding: 16 }}
    >
      <Text
        fontFamily="'Silkscreen', monospace"
        fontSize={56}
        fontWeight="700"
        color="$color12"
        letterSpacing={2}
        style={{ textShadow: '2px 2px 0 #bfa8', marginBottom: 24 }}
      >
        🔮 A Weird Card Game
      </Text>
      {round > 1 && (
        <Button
          backgroundColor="$color1"
          color="$color12"
          borderRadius={18}
          paddingVertical={12}
          paddingHorizontal={32}
          fontFamily="'Silkscreen', monospace"
          onPress={() => navigate('/game')}
        >
          Resume Game
        </Button>
      )}
      <Button
        backgroundColor="$color1"
        color="$color12"
        borderRadius={18}
        paddingVertical={12}
        paddingHorizontal={32}
        fontFamily="'Silkscreen', monospace"
        onPress={() => {
          resetGame();
          refreshStore(false);
          navigate('/game');
        }}
      >
        Start New Game
      </Button>
      <Button
        backgroundColor="$accent10"
        color="$color12"
        borderRadius={18}
        paddingVertical={12}
        paddingHorizontal={32}
        fontFamily="'Silkscreen', monospace"
        onPress={() => navigate('/shop')}
      >
        Upgrade Shop
      </Button>
      <Button
        backgroundColor="$accent8"
        color="$color12"
        borderRadius={18}
        paddingVertical={12}
        paddingHorizontal={32}
        fontFamily="'Silkscreen', monospace"
        onPress={() => navigate('/cards')}
      >
        Card Collection
      </Button>
    </Stack>
  );
}
