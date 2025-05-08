import { useRecoilValue } from 'recoil';
import { benchState } from '../recoil/atoms/benchState';
import Card from './Card';

export default function Bench() {
  const bench = useRecoilValue(benchState);
  // console.log('🏖️ Bench render → state =', bench);
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
        <Card key={i} cardId={id} location="bench" showHoverOn="click" />
      ))}
    </div>
  );
}
