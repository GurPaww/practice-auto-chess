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
  // useEffect(() => {
  //   console.log('Store mounted → refreshing...');
  //   refresh(false);
  // }, []);

  // debug each render
  // console.log('Store render → slots =', store);
  // console.log(cardPool)

  return (
    <div className="store">
      {store.map((id, idx) => (
        <Card key={idx} cardId={id} location="store" showHoverOn="click" />
      ))}
    </div>
  );
}
