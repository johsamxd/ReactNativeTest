import { Text, View } from 'react-native';
import { Offer } from '../../../api/offersApi';

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <View>
      <Text>{offer?.address}</Text>
    </View>
  );
}
