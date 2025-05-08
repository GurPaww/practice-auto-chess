import { useRecoilValue } from 'recoil';
import { benchState } from '../recoil/atoms/benchState';
import Card from './Card';

export default function Bench() {
  const bench = useRecoilValue(benchState);
  // console.log('🏖️ Bench render → state =', bench);
  return (
    <div className="bench">
      {bench.map((id, i) => (
        <Card key={i} cardId={id} location="bench" />
      ))}
    </div>
  );
}
