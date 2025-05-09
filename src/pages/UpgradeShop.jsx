// src/pages/UpgradeShop.jsx
import { useNavigate } from 'react-router-dom';
import upgradeConfig from '../data/upgradeConfig.json';
import UpgradeItem   from '../components/UpgradeItem';

export default function UpgradeShop() {
  const navigate = useNavigate();

  return (
    <div className="upgrade-shop">
      <header className="upgrade-header">
        <button className="button-main" onClick={() => navigate(-1)}>← Back</button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Upgrade Shop</h2>
        <div style={{ width: 60 }} />
      </header>
      <div className="upgrades-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 32, gap: 32 }}>
        {upgradeConfig.upgrades.map(u => (
          <UpgradeItem key={u.id} {...u} />
        ))}
      </div>
    </div>
  );
}

// No Recoil usage in this file, so no changes needed for Zustand.
