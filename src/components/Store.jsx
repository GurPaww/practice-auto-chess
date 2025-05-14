import { useRecoilValue } from 'recoil';
import { cardStoreState } from '../recoil/atoms/cardStoreState';
import Card from './Card';
import { Stack } from 'tamagui';

export default function Store() {
  const store = useRecoilValue(cardStoreState);

  return (
    <Stack className="store" flexDirection="row" gap={16} backgroundColor="$background" padding={16} borderRadius={18}>
      {store.map((id, idx) => (
        <Card key={idx} cardId={id} location="store" showHoverOn="click" slotIndex={idx} />
      ))}
    </Stack>
  );
}
