// src/pages/UpgradeShop.jsx
import { useNavigate } from 'react-router-dom';
import upgradeConfig from '../data/upgradeConfig.json';
import UpgradeItem   from '../components/UpgradeItem';

export default function UpgradeShop() {
  const navigate = useNavigate();

  return (
    <div className="upgrade-shop">
      <header>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Upgrade Shop</h2>
      </header>

      <div className="upgrades-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {upgradeConfig.upgrades.map(u => (
          <UpgradeItem key={u.id} {...u} />
        ))}
      </div>
    </div>
  );
}
