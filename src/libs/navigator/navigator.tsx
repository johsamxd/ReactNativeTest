import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OffersScreen, OffersDetailScreen } from '../../screens';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: OffersScreen,
      options: { headerShown: false },
    },
    Offer: {
      screen: OffersDetailScreen,
    },
  },
});

export const Navigator = createStaticNavigation(RootStack);
