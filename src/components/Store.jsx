import { useRecoilValue } from 'recoil';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import Card from './Card';

export default function Store() {
  const store = useRecoilValue(cardStoreState);
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
        <Card key={idx} cardId={id} location="store" showHoverOn="click" slotIndex={idx} />
      ))}
    </div>
  );
}
