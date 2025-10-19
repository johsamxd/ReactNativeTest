import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OffersScreen, OffersDetailScreen } from '../../screens';
import { Offer } from '../../api/offersApi';

export type RootStackParamList = {
  Offers: undefined;
  OfferDetail: { offer: Offer };
};

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    Offers: {
      screen: OffersScreen,
      options: { headerShown: false },
    },
    OfferDetail: {
      screen: OffersDetailScreen,
    },
  },
});

export const Navigator = createStaticNavigation(RootStack);
