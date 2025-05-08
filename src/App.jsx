import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenu    from './pages/MainMenu';
import GameScreen  from './pages/GameScreen';
import UpgradeShop from './pages/UpgradeShop';
import Collection  from './pages/Collection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<MainMenu/>} />
        <Route path="/game"   element={<GameScreen/>} />
        <Route path="/shop"   element={<UpgradeShop/>}/>
        <Route path="/cards"  element={<Collection/>}/>
      </Routes>
    </BrowserRouter>
  );
}
