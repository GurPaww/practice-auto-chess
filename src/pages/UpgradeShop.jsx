// src/pages/UpgradeShop.jsx
import { useNavigate } from 'react-router-dom';
import upgradeConfig from '../data/upgradeConfig.json';
import UpgradeItem   from '../components/UpgradeItem';

export default function UpgradeShop() {
  const navigate = useNavigate();

  return (
    <div className="upgrade-shop" style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f4f2e9 0%, #e0f7fa 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Comic Sans MS, Comic Sans, cursive',
      color: '#2d5c3b'
    }}>
      <header style={{ width: '100%', maxWidth: 700, margin: '24px auto 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 10,
          border: '2px solid #bfa',
          background: '#fff',
          color: '#2d5c3b',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: 8
        }}>← Back</button>
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
