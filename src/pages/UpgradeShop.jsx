// src/pages/UpgradeShop.jsx
import { useNavigate } from 'react-router-dom';
import upgradeConfig from '../data/upgradeConfig.json';
import UpgradeItem from '../components/UpgradeItem';
import { Stack, Button } from 'tamagui';

export default function UpgradeShop() {
  const navigate = useNavigate();

  return (
    <Stack className="upgrade-shop" minHeight="100vh" backgroundColor="$background" alignItems="center" padding={32}>
      <Stack className="upgrade-header" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%" maxWidth={700} marginVertical={24}>
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
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Upgrade Shop</h2>
        <div style={{ width: 60 }} />
      </Stack>
      <Stack className="upgrades-list" flexDirection="row" flexWrap="wrap" justifyContent="center" marginTop={32} gap={32}>
        {upgradeConfig.upgrades.map(u => (
          <UpgradeItem key={u.id} {...u} />
        ))}
      </Stack>
    </Stack>
  );
}
