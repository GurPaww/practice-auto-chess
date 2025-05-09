import { useRecoilValue, useSetRecoilState } from 'recoil';
import { benchState } from '../recoil/atoms/benchState';
import Card from './Card';
import { useState } from 'react';

export default function Bench() {
  const bench = useRecoilValue(benchState);
  const setBench = useSetRecoilState(benchState);
  const [highlighted, setHighlighted] = useState([]); // array of indices
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleBenchClick = (slotIndex) => {
    if (highlighted.includes(slotIndex)) {
      setHighlighted(highlighted.filter(i => i !== slotIndex));
    } else if (highlighted.length === 1) {
      // Swap
      const other = highlighted[0];
      if (other !== slotIndex) {
        setBench(b => {
          const newBench = [...b];
          [newBench[other], newBench[slotIndex]] = [newBench[slotIndex], newBench[other]];
          return newBench;
        });
      }
      setHighlighted([]);
    } else {
      setHighlighted([slotIndex]);
    }
  };

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (draggedIdx !== null && draggedIdx !== idx) {
      setBench(b => {
        const newBench = [...b];
        [newBench[draggedIdx], newBench[idx]] = [newBench[idx], newBench[draggedIdx]];
        return newBench;
      });
    }
    setDraggedIdx(null);
  };

  return (
    <div className="bench" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      background: '#e0f7fa',
      border: '2px solid #bfa',
      borderRadius: 18,
      padding: '18px 0',
      margin: '0 auto',
      minWidth: 420,
      minHeight: 120,
      boxShadow: '0 2px 8px #bfa6'
    }}>
      {bench.map((id, i) => (
        <Card
          key={i}
          cardId={id}
          location="bench"
          showHoverOn="click"
          slotIndex={i}
          highlighted={highlighted.includes(i)}
          onBenchClick={handleBenchClick}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(i)}
          isDragging={draggedIdx === i}
        />
      ))}
    </div>
  );
}
