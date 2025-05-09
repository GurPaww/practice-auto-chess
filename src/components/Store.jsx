import { useGameStore } from '../zustand/useGameStore';
import Card from './Card';

export default function Store() {
  const store = useGameStore(state => state.cardStore);
  if (!Array.isArray(store)) return null; // Prevent crash if store is not an array
  return (
    <div className="store">
      {store.map((id, idx) => (
        <Card key={idx} cardId={id} location="store" showHoverOn="click" slotIndex={idx} />
      ))}
    </div>
  );
}
