import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import { refreshStoreSelector } from '../recoil/selectors/storeSelectors';
// import { cardPoolState } from '../recoil/atoms/cardPoolState';
import Card from './Card';

export default function Store() {
  const store = useRecoilValue(cardStoreState);
  const refresh = useSetRecoilState(refreshStoreSelector);
  // const cardPool = useRecoilValue(cardPoolState)

  // initial fill on mount
  useEffect(() => {
    console.log('Store mounted → refreshing...');
    refresh(false);
  }, []);

  // debug each render
  // console.log('Store render → slots =', store);
  // console.log(cardPool)

  return (
    <div className="store" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      background: '#f8fff8',
      border: '2px solid #bfa',
      borderRadius: 18,
      padding: '18px 0',
      margin: '0 auto',
      minWidth: 420,
      minHeight: 160,
      boxShadow: '0 2px 8px #bfa6'
    }}>
      {store.map((id, idx) => (
        <Card key={idx} cardId={id} location="store" showHoverOn="click" />
      ))}
    </div>
  );
}
